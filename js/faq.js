// Perguntas frequentes — lidas de dados/orientacoes-faq.json
(async () => {
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let dados;
  try { dados = await (await fetch("dados/orientacoes-faq.json")).json(); } catch { return; }
  const lista = (dados.perguntas_frequentes || []).filter((x) => x.p && x.r);
  if (!lista.length) return;
  let alvo = document.getElementById("faq");
  if (!alvo) {
    alvo = document.createElement("section");
    alvo.id = "faq";
    const rodape = document.querySelector("footer");
    rodape ? rodape.before(alvo) : document.body.append(alvo);
  }
  alvo.classList.add("faq");
  alvo.innerHTML =
    '<div class="faq-caixa"><h2>Perguntas frequentes</h2>' +
    lista.map((x) => `<details><summary>${esc(x.p)}</summary><p>${esc(x.r)}</p></details>`).join("") +
    '<p class="faq-mais">Ficou com dúvida? <button type="button" class="faq-perguntar">Pergunte ao assistente</button></p></div>';
  alvo.querySelector(".faq-perguntar").addEventListener("click", () => {
    if (window.uropedPerguntar) window.uropedPerguntar("Tenho uma dúvida sobre o atendimento.");
  });
})();
