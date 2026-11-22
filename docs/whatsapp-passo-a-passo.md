# Assistente Uroped no WhatsApp — passo a passo

Número: **(77) 99914-1155** (só assistente; não fica no app WhatsApp do celular).
Código: `functions/api/whatsapp.js` (usa o mesmo cérebro do chat do site, `functions/api/chat.js`).
Endereço do webhook: `https://uroped-site.pages.dev/api/whatsapp`

## 0. Antes (Vivo)
- Linha ativa, recebendo SMS ou ligação.
- Se o número estiver no WhatsApp: fazer backup e **apagar a conta** nele (WhatsApp > Configurações > Conta > Apagar conta).

## 1. Portfólio empresarial (business.facebook.com)
- Entrar com o Facebook dono da página @gncarneiro.
- Criar portfólio "Uroped" (ou usar o existente) e adicionar a página.
- Depois: Central de Segurança > **Verificação da empresa** (CNPJ 43.395.179/0001-36). Sem verificar dá para testar; para atender o público sem limite, verificar.

## 2. App na Meta (developers.facebook.com)
- Meus apps > Criar app > tipo **Empresa** > nome "Uroped Assistente" > portfólio Uroped.
- Adicionar o produto **WhatsApp** > Configuração da API.
- **Adicionar número de telefone** > nome de exibição "Uroped" > categoria Saúde > código por SMS para o 99914-1155.
- Anotar a **Identificação do número de telefone** (Phone number ID) → `WHATSAPP_PHONE_ID`.
- App > Configurações > Básico > **Chave secreta do aplicativo** → `WHATSAPP_APP_SECRET`.
- Adicionar forma de pagamento na conta do WhatsApp (1.000 mensagens de atendimento grátis/mês; depois cobra por mensagem).

## 3. Token permanente
- business.facebook.com > Configurações > Usuários > **Usuários do sistema** > Adicionar (admin).
- Atribuir ativos: o app (controle total) e a conta do WhatsApp (controle total).
- **Gerar token** > app "Uroped Assistente" > validade **Nunca** > permissões `whatsapp_business_messaging` e `whatsapp_business_management` → `WHATSAPP_TOKEN`.

## 4. Cloudflare (dash.cloudflare.com > Workers e Pages > uroped-site > Configurações > Variáveis e segredos)
Adicionar como **Secret** (produção):
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_ID`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN` (uma senha inventada, ex.: uma frase sem espaços)

Opcional (memória curta da conversa, 2 h): Workers e Pages > **KV** > criar namespace `wa-hist`; no projeto > Configurações > Vinculações > KV > nome da variável `WA_HIST`.
Sem isso, cada mensagem é respondida sozinha e nada fica gravado.

Depois de salvar: Implantações > refazer a última implantação (para pegar os segredos).

## 5. Webhook (developers.facebook.com > app > WhatsApp > Configuração)
- URL de callback: `https://uroped-site.pages.dev/api/whatsapp`
- Verificar token: o mesmo `WHATSAPP_VERIFY_TOKEN`
- Verificar e salvar > Campos do webhook > assinar **messages**.

## 6. Testar
- Mandar "Onde o Dr. Gabriel atende?" para o (77) 99914-1155 de outro celular.
- Para pausar o robô: segredo/variável `WHATSAPP_PAUSADO` = `1` e refazer a implantação.

## Regras do assistente no WhatsApp
- Mesmas do site (nunca diagnostica, não inventa, encaminha ao WhatsApp da clínica para agendar).
- Pedido de humano/médico ou dúvida clínica → passa o WhatsApp da clínica.
- Urgência → pronto-socorro ou 192.
- Áudio/foto → pede para escrever.
