# Briefing — Site Uroped

> Documento-mestre do site de pacientes da Uroped. Serve para o Gabriel, para o Claude e para o agente do Antigravity.
> **Agente: leia este arquivo inteiro antes de criar ou alterar qualquer coisa. Não invente dados: o que estiver marcado `[PENDENTE]` fica como placeholder visível.**

Última atualização: 21/11/2026

**Arquivos desta pasta:**
- `BRIEFING.md`: este documento (visão geral e pendências)
- `dados/locais.json`: médicos, locais, serviços e valores em formato estruturado (fonte de dados do site)
- `docs/decisoes-e-pesquisa.md`: decisões tomadas, regras do CFM, domínio, Google Ads e próximos passos
- `esboco/`: código-fonte do esboço visual (referência) e link para vê-lo

---

## 1. Objetivo

Site para o paciente da região responder rápido a três perguntas:

1. **Quando** o médico atende na minha cidade?
2. **Onde** fica a clínica (e como chego lá)?
3. **Como** eu agendo?

O resto (formação, valores, serviços) existe para dar confiança e levar o paciente ao botão de agendar.

- **Domínio:** `uroped.social.br` (registrado no Registro.br, titular UROPED LTDA)
- **Público:** pacientes do oeste e sudoeste da Bahia, a maioria pelo celular, muitos com pouca familiaridade com internet → simples, letras grandes, botões grandes.
- **Empresa:** UROPED LTDA (urologia + pediatria) — Dr. Gabriel e Dra. Narcisa.

---

## 2. Estrutura do site

| Página | Endereço | Conteúdo |
|---|---|---|
| Início | `/` | Escolha da especialidade (Todos / Urologia / Pediatria) + cidade → cartões das clínicas com endereço, próxima data, **Como chegar** e **Agendar**. Mapa da região. Cartões "Conheça os médicos". |
| Dr. Gabriel | `/gabriel` | Topo com foto, CRM/RQE e botão de WhatsApp; agenda filtrável por cidade; cirurgias; serviços e valores; convênios; onde atendo; formação; dúvidas frequentes. |
| Dra. Narcisa | `/narcisa` | Mesmo modelo da página do Dr. Gabriel. |
| (futuro) Sistema | `sistema.uroped.social.br` | Gestão interna/CRM, com login. **Separado do site público** (LGPD). Fora do escopo agora. |

### Cartão de clínica (peça central)
- Faixa colorida com a especialidade/médico (azul = urologia, coral = pediatria)
- Nome da clínica + endereço + cidade
- Próxima data e horário
- Botão **Como chegar** → Google Maps
- Botão **Agendar** → WhatsApp com mensagem pronta (ex.: "Olá! Quero agendar consulta com o Dr. Gabriel em Correntina, na Climec, dia 03/12.")

---

## 3. Identidade visual (do esboço aprovado para seguir)

- **Esboço no Claude (canvas de design):** https://claude.ai/artifact/3UxU8WVjRDLFa2BR9eBcsB
- Mobile-first (390 px de referência), funciona também no computador.
- **Logo oficial:** `logos/uroped-logo.jpg` (gota com folhas; "Uro" azul-marinho, "p" verde-menta, "ed" coral; subtítulo "Urologia e Pediatria"). Pendente: versão vetorial (SVG) e versão só do símbolo (favicon/ícone).
- Cores (extraídas da logo):
  - Azul-marinho (marca, urologia, títulos): `#1B3F66`
  - Azul da gota: `#418BBC`
  - Verde-menta: `#72C2AA` (detalhes, fundos claros `#EAF6F2`)
  - Coral (pediatria): `#F5826A` para ilustração/fundos; **para texto e botões usar `#B4482B`** (o coral da logo não tem contraste suficiente sobre branco)
  - Verde WhatsApp (botões de agendar): `#1F8A4C`
  - Texto: `#13262E` · texto secundário `#4A5C63` · bordas `#E3EBEC` · fundo de seção `#F4F7F7`
- Fontes (Google Fonts): **Nunito** ou **Quicksand** (títulos, arredondada como a logo) e **Inter** (texto).
- Cantos arredondados (16–20 px), botões com altura mínima de 44 px.
- Ícones: traço simples (SVG). Sem emoji.
- Acessibilidade: contraste mínimo 4,5:1, botões e links de verdade (`<a>`, `<button>`), `alt` nas fotos.

---

## 4. Médicos

### Dr. Gabriel Neves Carneiro — Urologista
- CRM-BA 18.689 · RQE Urologia 11463 · RQE Cirurgia Geral 8547 → pode ser apresentado como "Urologista e Cirurgião Geral"
- Membro da Sociedade Brasileira de Urologia (SBU)
- Sócio do Instituto Geográfico e Histórico da Bahia (IGHB)
- Além do consultório: montanhista e fotógrafo (seção curta "Fora do consultório" na página dele)
- Formação:
  - Medicina — Universidade Federal da Bahia (UFBA)
  - Residência em Cirurgia Geral — Hospital Geral Roberto Santos
  - Residência em Urologia — Hospital Geral Roberto Santos
  - Pós-graduação em Cirurgia Urológica Minimamente Invasiva — Hospital Sírio-Libanês
  - Especialização em Cirurgia Ginecológica Minimamente Invasiva — Hospital Sírio-Libanês
  - Pós-graduação em Cirurgia Urológica Robótica — Hospital 9 de Julho
- Redes: Instagram @drgabrielurologista (https://www.instagram.com/drgabrielurologista/) · Facebook facebook.com/gncarneiro

### Dra. Narcisa de Oliveira Malheiro — Pediatra e Neonatologista
- CRM-BA 18.232 · RQE Pediatria 12652 · RQE Neonatologia 12653 → pode ser apresentada como "Pediatra e Neonatologista"
- Membro titular da Sociedade Brasileira de Pediatria (SBP)
- Formação:
  - Medicina — Universidade Federal de Alagoas (UFAL)
  - Residência em Pediatria — Hospital Universitário Professor Edgard Santos (HUPES/UFBA)
  - Formação em Neonatologia — Maternidade Professor José Maria de Magalhães Neto / Santa Casa de Misericórdia da Bahia
- Tipo de consulta: Acompanhamento integral e afetuoso desde os primeiros dias de vida: puericultura, crescimento saudável, incentivo ao aleitamento materno, introdução alimentar e cuidados especializados com o recém-nascido e prematuro.
- Redes: Instagram @dr.narcisa (confirmar grafia)

---

## 5. Locais de atendimento

### Dr. Gabriel — consultas

| Cidade | Clínica | Observação |
|---|---|---|
| Bom Jesus da Lapa | **Clínica Uroderma** | Clínica principal. Consultas, ultrassom, urofluxometria, estudo urodinâmico, cistoscopia, biópsia de próstata, pequenos procedimentos. **Único local com convênios.** |
| Bom Jesus da Lapa | Clínica Vila Rica | |
| Paratinga | Clivale | |
| Serra do Ramalho | Clínica Vila Rica | |
| Santa Maria da Vitória | Climef | Também cirurgias |
| Cocos | Climef | |
| Santana | Centro Médico Cárdenas Marín | |
| Serra Dourada | Clínica Vilas Boas | |
| Correntina | Climec `[confirmar: Climec ou Climef]` | Principal em Correntina |
| Correntina | Clínica Pedro Guerra | |
| Correntina | Clínica Vida e Saúde | |
| Riacho de Santana | Clínica Vida | |
| Macaúbas | Laboratório Pesquisa | |
| Botuporã | Clínica MedLab | |

### Dr. Gabriel — cirurgias
Tipos: cirurgias urológicas **laparoscópicas**, **endoscópicas** e **minimamente invasivas**. Exemplos de procedimentos `[PENDENTE]`.

- Fundação Hospital Senhora Santana — Caetité (WhatsApp (77) 9941-8816)
- Climef — Santa Maria da Vitória (confirmado 21/11)

### Dra. Narcisa

| Cidade | Clínica |
|---|---|
| Bom Jesus da Lapa | Vila Rica Kids |
| Bom Jesus da Lapa | Odontomed |
| Bom Jesus da Lapa | Cemed |
| Paratinga | Clivale |

Totais: Dr. Gabriel em 12 cidades (11 com consulta + Caetité só cirurgia); Dra. Narcisa em 2 cidades.

Para **cada** local ainda faltam: endereço `[PENDENTE]`, link do Google Maps `[PENDENTE]`, dias/frequência e horário `[PENDENTE]`.

## 5b. Agenda (padrão confirmado em 21/11/2026 — dar ênfase no site)

**Fixos (destaque principal)**
- Uroderma, Bom Jesus da Lapa: toda terça e quinta
- Vila Rica, Bom Jesus da Lapa + Vila Rica, Serra do Ramalho: segunda, a cada 15 dias (mesmo dia)
- Clivale, Paratinga: segunda, a cada 15 dias (alternando com a Vila Rica)
- Climec, Correntina: sexta, a cada 15 dias
- Climef, Santa Maria da Vitória: sexta à tarde, a cada 15 dias (muitas vezes no mesmo dia da Climec)
- Cirurgias em Caetité (Fundação Hospital Senhora Santana): quarta, a cada 15 dias

**Mensais**
- Pedro Guerra e Vida e Saúde, Correntina: sexta, cerca de 1 vez por mês
- Clínica Vida, Riacho de Santana: geralmente quinta, 1 a 2 vezes por mês
- Climef, Cocos: sábado, 1 vez por mês
- Santana (Cárdenas Marín) e Serra Dourada (Vilas Boas): quinta ou sexta, cerca de 1 vez por mês (mesmo dia)

**Eventuais** (mostrar como "datas sob consulta", sem destaque): Macaúbas (Laboratório Pesquisa), Botuporã (MedLab)

No site: cada cartão mostra o padrão ("Toda terça e quinta", "Segundas, a cada 15 dias"…) e, quando houver, a próxima data. Fonte das datas: Google Agenda do Dr. Gabriel (sugestão: agenda separada "Atendimentos Uroped").

---

## 6. Serviços e valores (Uroderma)

Exames e procedimentos (todos na Uroderma; valores `[PENDENTE]`):
- **Consulta:** consulta urológica
- **Ultrassonografia:** rins e vias urinárias; próstata via abdominal; próstata via transretal; região inguinal; bolsa testicular (escrotal)
- **Exames funcionais:** estudo urodinâmico; urofluxometria
- **Endoscopia urológica:** cistoscopia convencional (rígida); cistoscopia flexível
- **Procedimentos:** biópsia de próstata; pequenos procedimentos
Consulta pediátrica `[PENDENTE]`. Convênios aceitos na Uroderma `[PENDENTE lista]`.

---

## 7. Agendamento

- **Fase 1 (lançamento):** botão abre o WhatsApp (`https://wa.me/55DDDNUMERO?text=...`) com mensagem pronta contendo médico, cidade, clínica e data. Número(s) `[PENDENTE — um geral ou um por médico/clínica?]`
- **Fase 2 (futuro):** agendamento com horários reais, integrado ao CRM do consultório.

---

## 8. Manutenção

- **Agenda e valores** ficam numa **planilha do Google** que o Gabriel ou a secretária editam pelo celular; o site lê a planilha automaticamente (publicada como CSV). Ninguém mexe em código para atualizar datas.
- O restante (textos, formação, locais) muda pouco: alterações via Git.
- **Hospedagem:** GitHub Pages (grátis) com domínio `uroped.social.br` (DNS no Registro.br).
- **Publicação:** o Gabriel prefere receber os comandos prontos para rodar no Terminal do Mac (`git add` / `commit` / `push`).
- Stack sugerida: HTML + CSS + JavaScript simples, sem framework e sem build — fácil de manter e rápido em internet fraca.

---

## 9. Regras de publicidade médica (CFM — Resolução 2.336/2023)

- Toda página/peça mostra **nome, CRM e RQE** do médico.
- "Especialista em…" só para especialidade com RQE. Pós-graduações aparecem como formação, sem o título de especialista.
- Pode divulgar preço de consulta e serviços.
- Nada de sensacionalismo, promessa de resultado, "o melhor da região", antes/depois sem critério.
- Depoimentos de pacientes: só com moderação e sobriedade (melhor deixar de fora no lançamento).

---

## 10. Divulgação (depois do lançamento)

1. Perfil da Empresa no Google (Maps) da Uroderma, com link para o site.
2. QR code do site em receitas, cartões e na bio do Instagram.
3. Google Ads pequeno, segmentado por cidade e palavras como "urologista + cidade". Sem remarketing por condição de saúde (proibido pelo Google).

---

## 11. Pendências (checklist)

- [x] WhatsApp: todos os 19 locais preenchidos em `dados/locais.json`. Testar cada link antes de publicar (15 números vieram com 8 dígitos — verificar se falta o 9 inicial).
- [~] Agenda: padrão confirmado (seção 5b); faltam horários
- [ ] Endereço / link do Google Maps de cada clínica
- [ ] Valores da Uroderma e consulta da Dra. Narcisa
- [ ] Convênios aceitos na Uroderma
- [x] RQE: Narcisa OK (Pediatria 12652, Neonatologia 12653); Dr. Gabriel OK (Urologia 11463, Cirurgia Geral 8547)
- [ ] Grafia da clínica de Santana; Climec × Climef em Correntina
- [x] Instagram do Dr. Gabriel: @drgabrielurologista
- [x] Facebook do Dr. Gabriel: facebook.com/gncarneiro
- [x] Instagram da Dra. Narcisa: @dr.narcisa (confirmar)
- [x] Logo da Uroped: original `logos/uroped-logo.jpg` e fundo transparente `logos/uroped-logo-transparente.png` (usar sobre fundo claro). Falta: SVG e símbolo isolado
- [x] Foto oficial do Dr. Gabriel: `fotos/dr-gabriel.jpg` (820×820)
- [x] Foto oficial da Dra. Narcisa: `fotos/dra-narcisa.jpg` (446×450 — trocar pelo arquivo original em alta resolução quando possível)
- [ ] Logos das clínicas (pedir o arquivo PNG/SVG e a autorização a cada clínica; salvar em `logos/`)
- [x] Tipo de consulta da Dra. Narcisa: Puericultura, incentivo ao aleitamento materno, introdução alimentar e recém-nascido/prematuro

---

## Atualizações posteriores (21/11/2026, noite)
Ver **`docs/atualizacoes-21-11-noite.md`**: funcionamento por ordem de chegada (8h30/14h, 20–30 vagas), valores (consulta R$ 350; Cocos R$ 380; cistoscopia flexível e urodinâmica R$ 1.000; biópsia R$ 1.500; pediatria R$ 400 Lapa / R$ 300 Paratinga), biópsia completa, cirurgias, SUS, nomes oficiais (Uro·Derma, Clivale Med, Climefi, Cárdenas Marin) e pendências.
Dados para o site e o assistente: `dados/precos.json`, `dados/preparos.json`, `dados/orientacoes-faq.json`. Mapa interativo: `mapa.html`. Assistente/CRM: `docs/crm-assistente.md`, `assistente/instrucoes.md`.
