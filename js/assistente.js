// Janela de chat do assistente virtual Uroped
(() => {
  const SUGESTOES = [
    "Onde o Dr. Gabriel atende perto de mim?",
    "Quando é o próximo atendimento na minha cidade?",
    "Quanto custa a consulta?",
    "Precisa marcar? Como funciona a ordem de chegada?",
    "Quero agendar com a Dra. Narcisa (pediatra)",
    "Faz cirurgia de pedra nos rins, próstata ou vasectomia?",
  ];
  const BOAS_VINDAS =
    "Olá! Sou o assistente virtual da Uroped. Posso informar valores, datas e locais de atendimento do Dr. Gabriel e da Dra. Narcisa, e te encaminhar para agendar. Não sou médico e não faço avaliação de saúde. Em caso de urgência, procure o pronto-socorro.";

  const historico = [];
  let enviando = false;

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const formatar = (txt) => {
    let h = esc(txt);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/(https:\/\/[^\s<)]+)/g, (url) => {
      const rot = url.includes("wa.me") ? "Abrir WhatsApp" : url.includes("google.com/maps") ? "Ver no mapa" : url;
      return `<a href="${url}" target="_blank" rel="noopener">${rot}</a>`;
    });
    return h.replace(/\n/g, "<br>");
  };

  const raiz = document.createElement("div");
  raiz.className = "ia-root";
  raiz.innerHTML = `
    <button class="ia-abrir" type="button" aria-expanded="false" aria-controls="ia-painel">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>
      <span>Tire suas dúvidas</span>
    </button>
    <section class="ia-painel" id="ia-painel" role="dialog" aria-label="Assistente virtual Uroped" hidden>
      <header class="ia-topo">
        <div><strong>Assistente Uroped</strong><small>Respostas automáticas · não substitui consulta</small></div>
        <button class="ia-fechar" type="button" aria-label="Fechar">×</button>
      </header>
      <div class="ia-msgs" aria-live="polite"></div>
      <div class="ia-sug"></div>
      <form class="ia-form">
        <label class="ia-sr" for="ia-texto">Sua pergunta</label>
        <input id="ia-texto" type="text" maxlength="800" placeholder="Digite sua pergunta…" autocomplete="off">
        <button type="submit" aria-label="Enviar">Enviar</button>
      </form>
    </section>`;
  document.body.appendChild(raiz);

  const abrir = raiz.querySelector(".ia-abrir");
  const painel = raiz.querySelector(".ia-painel");
  const msgs = raiz.querySelector(".ia-msgs");
  const sug = raiz.querySelector(".ia-sug");
  const form = raiz.querySelector(".ia-form");
  const input = raiz.querySelector("#ia-texto");

  const add = (quem, html) => {
    const d = document.createElement("div");
    d.className = "ia-msg ia-" + quem;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  };

  add("bot", formatar(BOAS_VINDAS));
  sug.innerHTML = SUGESTOES.map((s) => `<button type="button">${esc(s)}</button>`).join("");
  sug.addEventListener("click", (e) => { if (e.target.tagName === "BUTTON") enviar(e.target.textContent); });

  const alternar = (aberto) => {
    painel.hidden = !aberto;
    abrir.setAttribute("aria-expanded", String(aberto));
    raiz.classList.toggle("ia-aberto", aberto);
    // Esconde botões flutuantes do site (ex.: WhatsApp) enquanto o chat está aberto
    document.querySelectorAll("body *").forEach((el) => {
      if (raiz.contains(el)) return;
      if (aberto) {
        if (getComputedStyle(el).position === "fixed" && el.offsetParent !== undefined) {
          el.dataset.iaOculto = "1";
          el.style.visibility = "hidden";
        }
      } else if (el.dataset.iaOculto) {
        delete el.dataset.iaOculto;
        el.style.visibility = "";
      }
    });
    if (aberto) input.focus();
  };
  abrir.addEventListener("click", () => alternar(painel.hidden));
  window.uropedPerguntar = (t) => { alternar(true); enviar(t); };
  raiz.querySelector(".ia-fechar").addEventListener("click", () => alternar(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !painel.hidden) alternar(false); });

  async function enviar(texto) {
    texto = (texto || "").trim();
    if (!texto || enviando) return;
    enviando = true;
    sug.hidden = true;
    add("user", esc(texto));
    historico.push({ role: "user", content: texto });
    const esperando = add("bot", '<span class="ia-digitando">digitando…</span>');
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: historico }),
      });
      const d = await r.json().catch(() => ({}));
      const resp = d.resposta || d.erro || "Não consegui responder agora. Fale com a clínica pelo WhatsApp.";
      esperando.innerHTML = formatar(resp);
      if (d.resposta) historico.push({ role: "assistant", content: d.resposta });
      else historico.pop();
    } catch {
      esperando.innerHTML = formatar("Sem conexão no momento. Tente de novo ou fale com a clínica pelo WhatsApp: https://wa.me/557798049628");
      historico.pop();
    } finally {
      enviando = false;
      msgs.scrollTop = msgs.scrollHeight;
    }
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); const t = input.value; input.value = ""; enviar(t); });
})();
