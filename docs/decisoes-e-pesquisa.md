# Decisões e pesquisa — Site Uroped

Registro do que foi decidido e por quê (conversa de 21/11/2026 com o Claude).

## Decisões tomadas

| Tema | Decisão | Motivo |
|---|---|---|
| Função do site | Vitrine + "quando/onde o médico atende na minha cidade" + agendamento | Agenda itinerante por 12 cidades é o diferencial; é o que o paciente mais procura |
| Navegação | Começa pela **cidade** (e especialidade), não pelo médico | É assim que o paciente do interior pensa |
| Médicos | Gabriel (urologia) e Narcisa (pediatria) no mesmo site, cada um com sua página | Uroped = uro + ped |
| Domínio | `uroped.social.br` | Registrado pelo Gabriel. Optou por manter só o .social.br |
| Agendamento | Fase 1: WhatsApp com mensagem pronta. Fase 2: horários reais ligados ao CRM | Funciona no primeiro dia, sem sistema |
| Manutenção | Agenda e valores numa planilha do Google lida pelo site | Secretária atualiza pelo celular sem mexer em código |
| Hospedagem | GitHub Pages + domínio próprio | Grátis; mesmo fluxo do site do museu |
| Ferramentas | Ideias/conteúdo/visual com o Claude; execução no Antigravity; documentação nesta pasta | Divisão de trabalho combinada |
| Pasta do projeto | `~/Downloads/site uroped` | Escolha do Gabriel |

## Sobre o domínio .social.br
- Categoria nova do Registro.br, aberta em 1º/09/2025, sem restrição de registro (CPF ou CNPJ), pensada para redes sociais e comunidades.
- Funciona normalmente para site e e-mail (`gabriel@uroped.social.br`).
- Cuidado: é menos familiar ao paciente que .com.br → usar **QR code** em receitas, cartões e bio do Instagram.
- Alternativas consideradas e não registradas: `uroped.com.br`, `uroped.med.br` (exclusivo de médicos, no CPF com CRM).

## Publicidade médica — Resolução CFM 2.336/2023 (em vigor desde 11/03/2024)
- Permite: divulgar preço de consultas e serviços, campanhas promocionais, anunciar pós-graduações concluídas, mostrar ambiente de trabalho e equipamentos.
- Exige: nome, CRM e RQE nas peças.
- "Especialista" só com RQE; pós-graduação aparece como formação.
- Proíbe: sensacionalismo, promessa de resultado, concorrência desleal.
- Fonte: portal.cfm.org.br (Resolução 2.336/2023 e Manual de Publicidade Médica 2024).

## Google Ads (para depois do lançamento)
- Permitido pela resolução (campanhas promocionais/anúncio do serviço).
- Concorrência baixa nas cidades do interior → clique barato.
- Segmentar por cidade e por período (ex.: anunciar em Cocos na semana antes do atendimento).
- Palavras-chave: "urologista + cidade", "urologista perto de mim", "exame de próstata", "vasectomia", "pedra no rim".
- Proibido: remarketing baseado em condição de saúde (política do Google).
- Antes do Ads: Perfil da Empresa no Google (Maps) da Uroderma, completo e com link para o site — gratuito e costuma render mais.

## Consulta de CRM/RQE
- Busca pública: portal.cfm.org.br/busca-medicos → UF BA → CRM 18689 (Gabriel) e 18232 (Narcisa).
- Não foi possível consultar automaticamente (formulário depende de navegador). Gabriel vai conferir e enviar os números.

## Próximos passos
1. Completar as pendências do BRIEFING.md (WhatsApp, agenda, endereços, valores, RQE, fotos).
2. Montar a página da Dra. Narcisa no esboço.
3. Criar a planilha do Google de agenda/valores.
4. Gerar o site (HTML/CSS/JS simples) nesta pasta e publicar no GitHub Pages.
5. Configurar o DNS do `uroped.social.br` no Registro.br.
6. Perfil do Google, QR codes e, por último, Google Ads.

## LinkedIn do Dr. Gabriel (lido em 21/11/2026)
- Perfil: linkedin.com/in/gabriel-carneiro-17430068 · 179 conexões · Bom Jesus da Lapa
- Experiência registrada:
  - Sócio proprietário — URODERMA (jan/2017 – atual), Bom Jesus da Lapa
  - Cirurgião Geral — Hospital Regional de Guanambi (fev/2013 – atual no perfil; confirmar se continua)
  - Membro — Instituto Geográfico e Histórico da Bahia (IGHB), ago/2016
  - Urologista — Hospital Nova Aliança, Guanambi (fev–mar/2013)
  - Urologista — Promed Centro Médico (jan–mar/2013)
  - Cirurgião Geral — Hospital Geral Roberto Santos (2011–2013)
  - Cirurgião Geral — Hospital Geral de Camaçari (2008–2012)
- Seção Formação: vazia. Sem "Sobre", certificações ou publicações visíveis.
- Sugestão: atualizar o LinkedIn com a formação e as pós (mesma lista do site) e colocar o link do site.
