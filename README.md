# collect-utm

> **Captura parâmetros UTM da URL e os salva em cookies**, garantindo que a origem da campanha seja preservada mesmo quando o visitante navega por várias páginas antes de preencher um formulário.

---

## O problema que este script resolve

Quando você investe em campanhas pagas (Google Ads, Meta Ads, e-mail marketing, etc.), os parâmetros UTM chegam **apenas na URL da primeira página visitada**:

```
https://seusite.com/landing-page?utm_source=google&utm_medium=cpc&utm_campaign=black-friday
```

Se o visitante navegar para outra página antes de converter, a URL muda e os parâmetros UTM **se perdem**:

```
https://seusite.com/produto/tenis-xpto  ← sem UTM
https://seusite.com/carrinho            ← sem UTM
https://seusite.com/contato             ← formulário aqui — UTM já foi!
```

Sem o cache de UTM, **você não sabe de qual campanha veio o lead**. Com este script, os parâmetros são salvos em cookies na primeira visita e lidos em qualquer página posterior.

```
Página 1 (landing) → UTM capturado e salvo em cookie (30 dias)
Página 2 (produto)  → cookie preservado
Página 3 (contato)  → formulário preenchido automaticamente com o UTM do cookie ✓
```

---

## Instalação

### 1. Adicione o script ao seu projeto

**Via tag `<script>` direto no HTML** (sem dependências obrigatórias):

```html
<!-- Coloque antes do </body> em todas as páginas do site -->
<script src="collect-utm.js"></script>
```

**Com jQuery** (carregue o jQuery antes do script):

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="collect-utm.js"></script>
```

O script detecta automaticamente se o jQuery está disponível e se adapta.

### 2. Adicione os campos ocultos no formulário

Em toda página que contém um formulário de conversão, inclua os campos hidden com os IDs correspondentes:

```html
<form action="/enviar" method="POST">
  <!-- Seus campos normais -->
  <input type="text"  name="nome"  placeholder="Seu nome">
  <input type="email" name="email" placeholder="Seu e-mail">
  <button type="submit">Enviar</button>

  <!-- Campos UTM ocultos — preenchidos automaticamente pelo script -->
  <input type="hidden" id="utm_source"   name="utm_source">
  <input type="hidden" id="utm_medium"   name="utm_medium">
  <input type="hidden" id="utm_campaign" name="utm_campaign">
  <input type="hidden" id="utm_content"  name="utm_content">
  <input type="hidden" id="utm_term"     name="utm_term">
</form>
```

> **Importante:** os atributos `id` devem ser exatamente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` para que o script encontre os campos.

---

## Como funciona

O script executa dois passos toda vez que uma página é carregada:

```
┌─────────────────────────────────────────────────────────────┐
│  PASSO 1 – A URL atual contém utm_* ?                       │
│                                                             │
│  SIM → lê cada parâmetro e salva em cookie (30 dias)        │
│  NÃO → pula (cookies anteriores não são apagados)           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  PASSO 2 – Preenche os campos do formulário                  │
│                                                             │
│  Para cada utm_* → lê o cookie → seta o valor no campo      │
└─────────────────────────────────────────────────────────────┘
```

### Parâmetros suportados

| Parâmetro      | Uso típico                                        |
|----------------|---------------------------------------------------|
| `utm_source`   | Origem do tráfego (`google`, `facebook`, `email`) |
| `utm_medium`   | Canal de marketing (`cpc`, `organic`, `newsletter`)|
| `utm_campaign` | Nome da campanha (`black-friday-2024`)             |
| `utm_content`  | Variação do anúncio (para testes A/B)             |
| `utm_term`     | Palavra-chave (Google Ads Search)                 |

---

## Exemplos de URLs com UTM

### Google Ads (CPC)

```
https://seusite.com/?utm_source=google&utm_medium=cpc&utm_campaign=marca&utm_term=seu+produto
```

### Meta Ads (Facebook / Instagram)

```
https://seusite.com/?utm_source=facebook&utm_medium=paid-social&utm_campaign=remarketing&utm_content=video-30s
```

### E-mail Marketing

```
https://seusite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=lancamento-produto
```

### WhatsApp / Link manual

```
https://seusite.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=indicacao
```

Use o [Criador de URL de campanha do Google](https://ga-dev-tools.google/campaign-url-builder/) para gerar links UTM facilmente.

---

## Configuração avançada

Você pode ajustar as constantes no topo do arquivo `collect-utm.js`:

```js
var COOKIE_DAYS = 30;  // Duração do cookie em dias (padrão: 30)
var COOKIE_PATH = '/'; // Caminho do cookie (padrão: domínio inteiro)
```

---

## Recebendo os dados no back-end

Os campos UTM chegam no seu servidor como qualquer outro campo do formulário:

```php
// PHP
$utm_source   = $_POST['utm_source']   ?? '';
$utm_medium   = $_POST['utm_medium']   ?? '';
$utm_campaign = $_POST['utm_campaign'] ?? '';
$utm_content  = $_POST['utm_content']  ?? '';
$utm_term     = $_POST['utm_term']     ?? '';
```

```python
# Python / Django
utm_source   = request.POST.get('utm_source', '')
utm_medium   = request.POST.get('utm_medium', '')
utm_campaign = request.POST.get('utm_campaign', '')
```

---

## Exemplo completo de página HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contato</title>
</head>
<body>

  <h1>Entre em contato</h1>

  <form action="/enviar" method="POST">
    <label>Nome: <input type="text"  name="nome"  required></label><br>
    <label>E-mail: <input type="email" name="email" required></label><br>
    <button type="submit">Enviar</button>

    <!-- Campos UTM ocultos -->
    <input type="hidden" id="utm_source"   name="utm_source">
    <input type="hidden" id="utm_medium"   name="utm_medium">
    <input type="hidden" id="utm_campaign" name="utm_campaign">
    <input type="hidden" id="utm_content"  name="utm_content">
    <input type="hidden" id="utm_term"     name="utm_term">
  </form>

  <!-- Script (sem jQuery necessário) -->
  <script src="collect-utm.js"></script>
</body>
</html>
```

---

## Resolução de problemas

**Os campos UTM chegam vazios no servidor**
- Verifique se o `id` dos campos hidden é exatamente `utm_source`, `utm_medium`, etc.
- Certifique-se de que o script está incluído **em todas as páginas** do site, não apenas na landing page.
- Abra o DevTools do navegador (F12 → Application → Cookies) e verifique se os cookies `utm_*` foram criados após acessar uma URL com parâmetros UTM.

**Os cookies não são gravados**
- Verifique se o site roda em HTTPS ou localhost (cookies com `SameSite=Lax` são bloqueados em contextos inseguros em alguns navegadores).
- Abra o console do navegador e procure por erros JavaScript.

**O script sobrescreve os UTMs antigos com valores vazios**
- Isso não acontece nesta versão: o Passo 1 só é executado quando a URL contém `utm_`, e cada parâmetro só é salvo se seu valor não for vazio.

---

## Licença

MIT — use à vontade, com ou sem atribuição.
