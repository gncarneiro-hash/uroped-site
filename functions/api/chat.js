// Assistente virtual Uroped — Cloudflare Pages Function (POST /api/chat)
// A chave fica só no Cloudflare: Settings > Variables and Secrets > ANTHROPIC_API_KEY (tipo Secret).
// Nenhuma conversa é gravada aqui. O registro do CRM (sem dados de saúde) vem numa etapa seguinte.

const MODEL = "claude-haiku-5-5";
const MAX_TURNS = 12;        // mensagens mantidas no histórico
const MAX_CHARS = 800;       // tamanho máximo de cada mensagem do paciente

let cache = { at: 0, system: null };

// Remove notas internas (campos que começam com "_") e o que não deve ser divulgado
function limpar(obj) {
  if (Array.isArray(obj)) return obj.map(limpar);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("_")) continue;
      if (k === "cirurgias_ginecologicas") continue; // aguardando decisão (CFM)
      out[k] = limpar(v);
    }
    return out;
  }
  return obj;
}

async function lerAsset(env, request, caminho, tipo = "json") {
  try {
    const url = new URL(caminho, request.url).toString();
    const r = env.ASSETS && env.ASSETS.fetch ? await env.ASSETS.fetch(url) : await fetch(url);
    if (!r.ok) return null;
    const txt = await r.text();
    return tipo === "json" ? JSON.parse(txt) : txt;
  } catch (e) {
    return null;
  }
}

export async function montarSistema(env, request) {
  if (cache.system && Date.now() - cache.at < 10 * 60 * 1000) return cache.system;

  const [instrucoes, locais, precos, preparos, faq] = await Promise.all([
    lerAsset(env, request, "/assistente/instrucoes.md", "text"),
    lerAsset(env, request, "/dados/locais.json"),
    lerAsset(env, request, "/dados/precos.json"),
    lerAsset(env, request, "/dados/preparos.json"),
    lerAsset(env, request, "/dados/orientacoes-faq.json"),
  ]);

  // Só preparos aprovados pelo médico
  const preparosOk = preparos
    ? { exames: (preparos.exames || []).filter((e) => e.aprovado) }
    : {};

  const hoje = new Date().toISOString().slice(0, 10);
  // Mantém só datas futuras na agenda
  const locaisFut = limpar(locais || {});
  for (const l of locaisFut.locais || []) {
    if (l.agenda && Array.isArray(l.agenda.proximas)) {
      l.agenda.proximas = l.agenda.proximas.filter((d) => d >= hoje);
    }
  }

  const system = `${instrucoes || ""}

## Formato das respostas
- Português do Brasil, frases curtas, tom acolhedor. No máximo ~6 linhas.
- Para agendar, sempre dê o link do WhatsApp da clínica no formato https://wa.me/NUMERO?text=MENSAGEM (mensagem curta, codificada para URL), usando o número do campo "whatsapp.wa" (ou "w") daquela clínica.
- Para "como chegar", use https://www.google.com/maps/search/?api=1&query=NOME+DA+CLINICA+CIDADE+BA
- Datas da agenda podem mudar: diga "próxima data prevista" e oriente confirmar pelo WhatsApp.
- Hoje é ${hoje}.

## DADOS OFICIAIS (use somente isto; se não estiver aqui, diga que não sabe e encaminhe ao WhatsApp)
### Locais, médicos, agenda e WhatsApp
${JSON.stringify(locaisFut)}
### Valores, serviços e cirurgias
${JSON.stringify(limpar(precos || {}))}
### Preparos aprovados
${JSON.stringify(limpar(preparosOk))}
### Orientações e perguntas frequentes
${JSON.stringify(limpar(faq || {}))}`;

  cache = { at: Date.now(), system };
  return system;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function onRequestPost(ctx) {
  try {
    return await atender(ctx);
  } catch (e) {
    return json({ erro: "O assistente está indisponível agora. Fale com a clínica pelo WhatsApp.", detalhe: String(e && e.message || e).slice(0, 200) }, 500);
  }
}

async function atender({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ erro: "Assistente ainda não configurado." }, 503);
  }

  // Só aceita chamadas do próprio site
  const origem = request.headers.get("origin") || "";
  const host = new URL(request.url).host;
  let hostOrigem = "";
  try { hostOrigem = origem ? new URL(origem).host : ""; } catch { hostOrigem = "invalido"; }
  if (origem && hostOrigem !== host) return json({ erro: "Origem não permitida." }, 403);

  let corpo;
  try { corpo = await request.json(); } catch { return json({ erro: "Requisição inválida." }, 400); }

  const msgs = Array.isArray(corpo.messages) ? corpo.messages : [];
  const historico = msgs
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!historico.length || historico[historico.length - 1].role !== "user") {
    return json({ erro: "Mensagem vazia." }, 400);
  }
  while (historico.length && historico[0].role !== "user") historico.shift();

  const system = await montarSistema(env, request);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "authorization": "Bearer " + String(env.ANTHROPIC_API_KEY).replace(/[^\x21-\x7E]/g, ""),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: historico,
    }),
  });

  if (!r.ok) {
    const det = (await r.text()).slice(0, 200);
    return json({ erro: "O assistente está indisponível agora. Fale com a clínica pelo WhatsApp.", detalhe: "API " + r.status + " " + det, chave: (function(k){k=String(k||"");var c=k.replace(/[^\x21-\x7E]/g,"");return c.slice(0,11)+"… tam "+c.length+" (bruto "+k.length+")";})(env.ANTHROPIC_API_KEY) }, 502);
  }
  const data = await r.json();
  const texto = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  if (!texto) return json({ resposta: "Não consegui responder agora. Fale com a clínica pelo WhatsApp.", detalhe: "vazio stop=" + data.stop_reason + " tipos=" + (data.content || []).map((c) => c.type).join(",") });
  return json({ resposta: texto });
}

export async function onRequest() {
  return json({ erro: "Use POST." }, 405);
}
