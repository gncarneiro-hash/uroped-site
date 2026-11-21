# Assistente de IA + CRM de pacientes — Uroped

Base do projeto (21/11/2026). Objetivo: responder às dúvidas mais comuns dos pacientes 24h por dia e encaminhar cada um para a clínica e o WhatsApp certos, registrando o que foi pedido.

---

## 0. Foco definido pelo Dr. Gabriel (21/11/2026)

O CRM serve principalmente para:
1. **Encaminhar** o paciente para a clínica certa (a mais próxima da cidade dele)
2. Informar as **datas de atendimento** de cada clínica
3. Informar o **valor da consulta em cada clínica** (o valor pode variar por clínica)

Exames, preparos e orçamentos de cirurgia ficam como complemento.

## 0b. Regra de funcionamento
- Atendimento por **ordem de chegada** (pacientes majoritariamente da zona rural; horário marcado gera conflito).
- **20 a 30 vagas por dia** em cada clínica (consultas + retornos).
- O CRM controla vagas por data/clínica: ao lotar, oferece a próxima data ou **lista de espera**.

## 1. O que o assistente faz

| Pergunta do paciente | Como responde | Fonte |
|---|---|---|
| "Quanto custa a consulta / o exame?" | Valor da tabela | `dados/precos.json` |
| "Quando o doutor atende em [cidade]?" | Padrão + próxima data | `dados/locais.json` → `agenda` |
| "Qual o lugar mais perto de mim?" | Cidade mais próxima com atendimento | `dados/cidades-distancias.json` |
| "Onde fica a clínica?" | Endereço + link do Maps | `dados/locais.json` |
| "Quanto custa a cirurgia X?" | Faixa "a partir de", valor final só após consulta | `dados/precos.json` |
| "Precisa de preparo para o exame?" | Orientação de preparo aprovada pelo médico | `dados/preparos.json` |
| "Aceita meu convênio?" | Lista da Uroderma | `dados/locais.json` |
| "Quero marcar" | Botão do WhatsApp da clínica certa, com mensagem pronta | `dados/locais.json` → `whatsapp` |

## 2. O que o assistente NÃO faz (regras fixas)

1. **Não dá diagnóstico, opinião médica ou orientação de tratamento.** Sintomas → "Isso precisa ser avaliado em consulta". Sinais de alarme (febre com dor lombar, retenção urinária, sangramento intenso, dor testicular súbita, criança muito prostrada) → orientar **procurar pronto-socorro agora**.
2. **Não marca consulta sozinho** (fase 1): encaminha para o WhatsApp da clínica.
3. **Não pede nem guarda dados de saúde** (LGPD). Só nome, cidade e interesse.
4. **Se apresenta como assistente automático** logo na primeira mensagem.
5. **Não inventa:** se a informação não está nos dados, diz que não sabe e encaminha.
6. **Publicidade médica (CFM 2.336/2023):** sem promessa de resultado, sem "o melhor", sem comparar com outros médicos.

## 3. Fluxo da conversa

```
Paciente abre o chat
  → Saudação + aviso de assistente automático
  → "Você procura Urologia (Dr. Gabriel) ou Pediatria (Dra. Narcisa)?"
  → "Em qual cidade você mora?"
  → Responde a dúvida (valor / data / local / preparo)
  → Oferece: [Agendar pelo WhatsApp da clínica X]
  → Registra o atendimento no CRM (seção 5)
```

## 4. Fases

| Fase | Onde | Como | Custo |
|---|---|---|---|
| **1** | Chat no site uroped.social.br | IA (Claude) lendo os arquivos de `dados/` | Baixo: paga só o uso da IA |
| **2** | WhatsApp | API oficial do WhatsApp Business (Meta) via provedor | Por conversa + aprovação da Meta |
| **3** | CRM completo | Painel em `sistema.uroped.social.br` com login: leads, funil, retornos | Integra com o CRM do consultório |

## 5. CRM — o que registrar de cada conversa

Arquivo/planilha `crm/atendimentos` (sem dados de saúde):

| Campo | Exemplo | Obs. |
|---|---|---|
| data_hora | 2026-11-21 17:05 | automático |
| canal | site / whatsapp | |
| especialidade | urologia / pediatria | |
| cidade_paciente | Cocos | |
| assunto | valor / agenda / local / preparo / orçamento / convênio / outro | categoria, não texto livre |
| servico | Ultrassom de próstata transretal | se houver |
| encaminhado_para | Climef — Cocos | clínica |
| nome | (opcional) | só se o paciente informar |
| telefone | (opcional) | só se o paciente informar |
| status | novo → contatado → agendado → atendido / perdido | atualizado pela secretária |
| observacao_secretaria | | **nunca** colocar sintomas ou diagnóstico |

**Relatórios úteis (mensal):** perguntas por cidade, serviços mais procurados, taxa de agendamento, cidades com demanda sem atendimento.

## 6. Arquivos de dados

| Arquivo | Status |
|---|---|
| `dados/locais.json` | ✅ clínicas, WhatsApp, agenda, médicos |
| `dados/precos.json` | ⏳ modelo pronto; aguardando valores |
| `dados/preparos.json` | ⏳ modelo pronto; textos a aprovar pelo Dr. Gabriel |
| `dados/cidades-distancias.json` | ⏳ a gerar (cidades vizinhas → cidade de atendimento mais próxima) |
| `assistente/instrucoes.md` | ✅ rascunho das instruções da IA |

## 7. Próximos passos

1. Preencher `precos.json` (consulta, exames, faixas de procedimentos) — **próxima conversa**
2. Aprovar textos de preparo dos exames
3. Gerar a tabela de cidades vizinhas → atendimento mais próximo
4. Construir o chat do site (fase 1) e testar com perguntas reais
5. Planilha do CRM para a secretária
