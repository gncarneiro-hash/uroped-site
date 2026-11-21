# Atualizações de 21/11/2026 (noite) — site e CRM

Informações passadas pelo Dr. Gabriel depois das 17h. Valem para o site **e** para o assistente/CRM. Os dados estruturados estão em `dados/precos.json`, `dados/preparos.json` e `dados/orientacoes-faq.json`.

## Funcionamento
- Atendimento por **ordem de chegada** (pacientes da zona rural; horário marcado gera conflito).
- **20 a 30 vagas por dia** por clínica (consultas + retornos).
- Início: **manhã a partir das 8h30**, **tarde a partir das 14h**. Falta: turno de cada clínica.
- **Retorno incluso** na consulta, geralmente em 30 a 60 dias.
- Pagamento: **Pix, débito, crédito com parcelamento e dinheiro** (nº de parcelas a confirmar).
- Orientações gerais: idosos sempre acompanhados; trazer exames anteriores, receitas/lista de remédios, documento e encaminhamento.

## Valores
| Item | Valor |
|---|---|
| Consulta urológica | **R$ 350** em todas as clínicas, exceto **Climefi Cocos R$ 380** e **Laboratório Pesquisa (Macaúbas) a confirmar** (provável R$ 300) |
| Cistoscopia flexível | **R$ 1.000** — Uro·Derma, Climec (Correntina), Climefi (Santa Maria da Vitória), Climefi (Cocos), Clínica Vida (Riacho de Santana), Laboratório Pesquisa (Macaúbas), Clivale Med (Paratinga) |
| Estudo urodinâmico | **R$ 1.000** — só Uro·Derma; homens e mulheres; idosos acompanhados |
| Biópsia de próstata | **R$ 1.500** (inclui coleta, análise no CEDAPI – Centro Diagnóstico Pires, Feira de Santana, acompanhamento e retorno com resultado) |
| Cirurgias | Orçamento após consulta |

## Biópsia de próstata
- Locais: Uro·Derma, Clivale Med, Climefi (Santa Maria da Vitória), Climefi (Cocos), Climec (Correntina), Cárdenas Marin (Santana), Vilas Boas (Serra Dourada), Laboratório Pesquisa (Macaúbas).
- Anestesia local, guiada por ultrassom; segue AUA e EAU.
- Preparo: jejum 8 h sólidos / 6 h líquidos; vir acompanhado; anticoagulante só suspender com orientação do médico assistente; exames pré-procedimento pedidos pelo médico.
- Aceita pacientes encaminhados por outros médicos.

## Textos institucionais
- Consultas seguem as diretrizes da **SBU, AUA e EAU** (European Association of Urology).
- "Nosso atendimento segue o Código de Ética Médica e o Código de Defesa do Consumidor: informação clara, valores transparentes e respeito à sua privacidade e às suas decisões."

## Cirurgias (particulares em Caetité — Fundação Hospital Senhora Santana — e Climefi Santa Maria da Vitória)
- **Destaque 1 — Pedra nos rins/ureter (principal área):** ureterolitotripsia e nefrolitotripsia transureteroscópicas, laser e litotridor balístico.
- **Destaque 2 — Próstata ("ampla experiência"):** RTU de próstata e prostatectomia transvesical (HPB); prostatectomia radical aberta (Caetité); **prostatectomia radical robótica no Hospital das Clínicas Dr. Mário Ribeiro da Silveira, Montes Claros (MG)**, com consulta prévia no consultório particular.
- Vasectomia (Uro·Derma, Climefi SMV, Caetité) e reversão (vasovasoanastomose).
- Uroginecologia: sling transobturatório, prolapsos vesical/uterino/retal, períneo.
- Bolsa escrotal: hidrocele, varicocele.
- **Crianças (a partir de 6 meses, Caetité e Climefi SMV):** postectomia (fimose), hidrocele, hérnia inguinal, orquidopexia aberta e laparoscópica.
- Cirurgia geral (RQE 8547): colecistectomia videolaparoscópica, hernioplastia inguinal e umbilical.
- **A decidir (sem RQE em Ginecologia — consultar CREMEB antes de divulgar):** ooforectomia, laqueadura laparoscópica, histerectomia, histeroscopia diagnóstica/cirúrgica (Climefi SMV).

## SUS (seção informativa, sem destaque)
Hospital Municipal Carmela Dutra (Bom Jesus da Lapa — consultas e cirurgias), redes municipais de Correntina e Riacho de Santana. Acesso pela UBS/Secretaria de Saúde; o assistente não informa valores nem encaminha para WhatsApp particular.

## Nomes oficiais confirmados pelas logos
- **Uro·Derma** · **Clivale Med** (Paratinga) · **Climefi** Centro Médico (Santa Maria da Vitória; Cocos a confirmar) · **Clínica Vida** (Riacho de Santana) · **Centro Médico Cárdenas Marin** (Santana)
- Logos em `logos/clinicas/`.

## Mapa interativo
- Publicado para teste: https://claude.ai/artifact/Lpfkfq9XBAp6Sx87sgNnau
- Arquivo: `site/mapa.html` (esquemático, pinos no centro das cidades; trocar por mapa de ruas no site final).

## Pendências
- Turno (manhã/tarde) de cada clínica · endereços/links do Maps · nº de parcelas · valor em Macaúbas · preparo da cistoscopia flexível e da urodinâmica (bexiga cheia? diário miccional?) · valores de vasectomia/reversão · agenda e valores da Dra. Narcisa · logos das demais clínicas · Climefi Cocos = mesma marca?
