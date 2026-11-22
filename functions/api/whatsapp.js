// Assistente Uroped no WhatsApp — Cloudflare Pages Function (GET/POST /api/whatsapp)
// Usa o MESMO cérebro do chat do site (instruções + dados oficiais de chat.js).
//
// Segredos no Cloudflare (Settings > Variables and Secrets, tipo Secret):
//   WHATSAPP_TOKEN         token permanente do usuário do sistema (Meta Business)
//   WHATSAPP_PHONE_ID      "Identificação do número de telefone" (WhatsApp > Configuração da API)
//   WHATSAPP_VERIFY_TOKEN  uma senha que você inventa; a mesma vai no campo "Verificar token" do webhook
//   WHATSAPP_APP_SECRET    "Chave secreta do aplicativo" (App > Configurações > Básico)
//   ANTHROPIC_API_KEY      (já existe, é a mesma do site)
// Opcionais:
//   WHATSAPP_PAUSADO = "1" desliga as respostas automáticas (a mensagem chega, mas o robô fica quieto)
//   GRAPH_VERSION        versão da API da Meta (padrão v23.0)
//   WA_HIST              namespace KV (vinculação) para lembrar a conversa por 2 horas. Sem ele, cada
//                        mensagem é respondida sozinha, sem memória — e nada fica gravado.

import { montarSistema } from "./chat.js";

const MODEL = "claude-haiku-5-5";
const MAX_CHARS = 800;          // tamanho máximo lido de cada mensagem do paciente
const HIST_MSGS = 10;           // mensagens lembradas (só com WA_HIST)
const HIST_TTL = 2 * 60 * 60;   // 2 horas

const CANAL = `

## Canal: WhatsApp oficial da Uroped
- O paciente está conversando pelo WhatsApp. Escreva como mensagem de WhatsApp: curta, sem títulos, sem tabelas.
- Formatação do WhatsApp: *negrito* com um asterisco de cada lado. Nada de [texto](link): escreva o link puro.
- Este número é atendido só pelo assistente. Para agendar, confirmar horário ou falar com uma pessoa, passe o link wa.me da clínica certa (como no site).
- Se a pessoa pedir para falar com um humano, com o médico, ou trouxer dúvida clínica: diga com gentileza que este canal é automático e passe o WhatsApp da clínica.
- Urgência ou emergência (dor forte, sangramento, febre alta em bebê, falta de ar etc.): oriente procurar o pronto-socorro mais próximo ou ligar 192 (SAMU) imediatamente.
- Não peça nem registre dados pessoais além do necessário (nome e cidade bastam para a mensagem pronta).`;

const SEM_TEXTO = "Olá! Por aqui eu consigo ler só mensagens de texto. Pode escrever sua dúvida? 😊";
const FALHA = "Desculpe, não consegui responder agora. Para agendar ou tirar dúvidas, veja os contatos das clínicas em https://uroped-site.pages.dev";

export async function onRequestGet({ request, env }) {
  // Verificação do webhook pela Meta
  const u = new URL(request.url);
  const modo = u.searchParams.get("hub.mode");
  const token = u.searchParams.get("hub.verify_token");
  const desafio = u.searchParams.get("hub.challenge") || "";
  if (modo === "subscribe" && env.WHATSAPP_VERIFY_TOKEN && token === env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(desafio, { status: 200, headers: { "content-type": "text/plain" } });
  }
  return new Response("Proibido", { status: 403 });
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const bruto = await request.text();

  // Só aceita o que vem assinado pela Meta
  if (!(await assinaturaValida(bruto, request.headers.get("x-hub-signature-256"), env.WHATSAPP_APP_SECRET))) {
    return new Response("Assinatura inválida", { status: 401 });
  }

  let corpo;
  try { corpo = JSON.parse(bruto); } catch { return new Response("ok"); }

  const mensagens = [];
  for (const entry of corpo.entry || []) {
    for (const ch of entry.changes || []) {
      const v = ch.value || {};
      if (env.WHATSAPP_PHONE_ID && v.metadata && v.metadata.phone_number_id &&
          v.metadata.phone_number_id !== env.WHATSAPP_PHONE_ID) continue;
      for (const m of v.messages || []) mensagens.push(m);
    }
  }

  // Responde 200 na hora (a Meta reenvia se demorar) e trabalha em segundo plano
  if (mensagens.length && env.WHATSAPP_PAUSADO !== "1") {
    ctx.waitUntil(Promise.all(mensagens.map((m) => tratar(m, ctx))).catch(() => {}));
  }
  return new Response("ok");
}

export async function onRequest() {
  return new Response("Use GET ou POST.", { status: 405 });
}

// ---------------------------------------------------------------------------

async function tratar(m, { request, env }) {
  const de = m.from;
  if (!de) return;

  // Evita responder duas vezes à mesma mensagem (reenvio da Meta)
  if (env.WA_HIST) {
    const chaveId = "id:" + m.id;
    if (await env.WA_HIST.get(chaveId)) return;
    await env.WA_HIST.put(chaveId, "1", { expirationTtl: 24 * 60 * 60 });
  }

  await marcarLida(env, m.id);

  if (m.type !== "text" || !m.text || !m.text.body) {
    await enviar(env, de, SEM_TEXTO);
    return;
  }

  const texto = m.text.body.slice(0, MAX_CHARS);
  const chaveHist = env.WA_HIST ? "h:" + (await sha256(de)) : null;

  let historico = [];
  if (chaveHist) {
    try { historico = JSON.parse((await env.WA_HIST.get(chaveHist)) || "[]"); } catch { historico = []; }
  }
  historico.push({ role: "user", content: texto });
  historico = historico.slice(-HIST_MSGS);
  while (historico.length && historico[0].role !== "user") historico.shift();

  let resposta = FALHA;
  try {
    const system = (await montarSistema(env, request)) + CANAL;
    resposta = (await perguntar(env, system, historico)) || FALHA;
  } catch (e) {
    resposta = FALHA;
  }

  await enviar(env, de, paraWhatsApp(resposta));

  if (chaveHist && resposta !== FALHA) {
    historico.push({ role: "assistant", content: resposta });
    await env.WA_HIST.put(chaveHist, JSON.stringify(historico.slice(-HIST_MSGS)), { expirationTtl: HIST_TTL });
  }
}

async function perguntar(env, system, historico) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "authorization": "Bearer " + String(env.ANTHROPIC_API_KEY || "").replace(/[^\x21-\x7E]/g, ""),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: historico,
    }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  return (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
}

// Converte o pouco de Markdown que possa vir para o formato do WhatsApp
function paraWhatsApp(t) {
  return t
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1: $2")  // [texto](link) -> texto: link
    .replace(/\*\*([^*]+)\*\*/g, "*$1*")                          // **negrito** -> *negrito*
    .replace(/^#{1,6}\s*/gm, "")                                   // títulos
    .slice(0, 4000);                                               // limite do WhatsApp: 4096
}

function graph(env) {
  return "https://graph.facebook.com/" + (env.GRAPH_VERSION || "v23.0") + "/" + env.WHATSAPP_PHONE_ID + "/messages";
}

async function enviar(env, para, texto) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_ID) return;
  await fetch(graph(env), {
    method: "POST",
    headers: { "authorization": "Bearer " + env.WHATSAPP_TOKEN, "content-type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: para,
      type: "text",
      text: { body: texto, preview_url: true },
    }),
  });
}

async function marcarLida(env, id) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_ID || !id) return;
  try {
    await fetch(graph(env), {
      method: "POST",
      headers: { "authorization": "Bearer " + env.WHATSAPP_TOKEN, "content-type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: id }),
    });
  } catch {}
}

async function assinaturaValida(corpo, cabecalho, segredo) {
  if (!segredo || !cabecalho || !cabecalho.startsWith("sha256=")) return false;
  const enc = new TextEncoder();
  const chave = await crypto.subtle.importKey("raw", enc.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", chave, enc.encode(corpo)));
  const esperado = [...sig].map((b) => b.toString(16).padStart(2, "0")).join("");
  const recebido = cabecalho.slice(7).toLowerCase();
  if (recebido.length !== esperado.length) return false;
  let dif = 0;
  for (let i = 0; i < esperado.length; i++) dif |= esperado.charCodeAt(i) ^ recebido.charCodeAt(i);
  return dif === 0;
}

async function sha256(s) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return [...h].map((b) => b.toString(16).padStart(2, "0")).join("");
}
