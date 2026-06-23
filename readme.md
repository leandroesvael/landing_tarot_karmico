# CPW — 🎴♦️♠️ Landing Page Tarot ♥️♣️🃏

## INTRODUÇÃO 

A página representa uma landing page (página de aterrisagem) que visa a captura de leads para contato futuro com o cliente ou já disponibilizar o contato direto através do wp. 
A estruturada utiliza seções verticais, e cada etapa representa um momento do usuário: 
- entrada
- interação
- resposta
- conversão. 
 
---

## REQUISITOS

**W3C**

![Validação de Contraste](assets/w3c_validacao.png)

**CONTRAST CHECKER**

Combinação avaliada:

- Texto: #FFFFFF
- Fundo: #1B1031

Resultado:
- Razão de contraste: 18.02:1

![Validação de Contraste](assets/contrast_checker.png)


**3 CAMADAS**
- INDEX.HTML
- STYLE.CSS
- MAIN.JS

**SCRIPT JS**

```html
<!-- linha 258    -->
<div id="resultCard" class="result-card hidden"> <!-- duas classes -->
<!-- id utilizado no js -->
<p id="resultText"></p>
```

```js
form.addEventListener("submit", ...)

resultCard.classList.remove("hidden"); 
```
```css
.hidden {
 display:none;
}
```


```html
<!-- fica apenas a visivel -->
<div class="result-card">
<p id="resultText"></p>
```


## 📚​ ORGANIZAÇÃO DA PÁGINA

### ​ESTRUTURA

```
HEADER
LOGO    |    MENU
↓
HERO 
HERO CONTENT | HERO IMG
↓
COMO FUNCIONA (STEPS)   
STPE1 | STPE2 | STPE3
↓
ABOUT
IMG | TEXT
↓
DEPOIMENTOS
↓
FAQ
↓
PRE FORM
↓
FORM
↓
RESULTADO (ESCONDIDO)
↓
FOOTER
```

## LAYOUT

Vertical + centrado

```css
.hero {
  padding: 100px 10%;
  text-align: center;
}


.header {
  display: flex;
  justify-content: space-between; /* justify-content: center; gap: 20px --> cards [] [] [] *
  align-items: center;
}
```
Uma forma de organizar elementos em linha (horizontal) ou coluna (vertical)

- LOGO    |    MENU

---

## ​PONTOS FORTES
- conexao com google forms para captura
- código simples: utilizacao de js para mensagens 
- responsividade

## TRECHOS DE CODIGO EXPLICATIVOS

```css
/*HEADER*/

.header {
  display: flex;
  justify-content: space-between;
}
↓
LOGO    |    MENU
```
---
```
.cards {
  display: flex;  /* */
}
↓
[card]  [card]  [card]
```
### FLUXOS
```
Menu
↓
clica Sobre
↓
scroll suave

Menu
↓
clica Experimente
↓
vai para formulário

Menu
↓
clica Contato
↓
vai para footer
```

#### EVOLUÇÕES

0. SEO (  
- Meta Description
- Integração com Google Search Console
- Google Analytics
)

1. Menu hambúrguer mobile

2. Integração com WhatsApp API

3. Integração com Google Analytics

4. Visualizar leads 

5. Sistema de agendamento online

6. Biblioteca maior de mensagens


## MELHORIAS  💡

#### MELHORIA 1 -INSERIR NO FOOTER OS LINKS REAIS

INSTA - WP - YOUTUBE

#### MELHORIA 2 - Abrir o formulário (progressivo)

O form começa escondido → botão revela.

Quando usar

quando quer criar curiosidade
quando quer simplificar a tela inicial

```css
.form-section {
  display: none;
}
```
```java script
document.querySelector(".hero-btn").addEventListener("click", () => {
  document.querySelector(".form-section").style.display = "flex";
});
```

#### MELHORIA 2 — Pré-engajamento (mais avançado)

Antes do formulário, você faz 1 pergunta.
Ex:

“Qual área da sua vida?”
Amor / carreira / decisões

Resultado

usuário já se compromete
aumenta conversão depois

## Estrutura ideal

```
Jogada 1 → gratuita
Jogada 2 → bloqueada → pede dados
```

Como implementar só com JavaScript 

```java script
let plays = 0;

function drawCard() {
  if (plays >= 1) {
    showForm();
    return;
  }

  plays++;

  showMessage();
}

function showForm() {
  document.querySelector(".form-section").style.display = "flex";
}

//limitar refresh
let plays = localStorage.getItem("plays") || 0;
plays = Number(plays);

plays++;
localStorage.setItem("plays", plays);
```

