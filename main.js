// ELEMENTOS DA INTERFACE

const form = document.getElementById("oracleForm");  
const formSuccess = document.getElementById("formSuccess");
const formSubmitButton = form.querySelector('button[type="submit"]');

const cardMessage = document.getElementById("cardMessage");
const cardShuffle = document.getElementById("cardShuffle");
const shuffleCards = document.querySelectorAll(".shuffle-card");

const shuffleSound = new Audio("audio/embaralhar.wav");
const revealSound = new Audio("audio/revelacao.mp3");

shuffleSound.volume = 0.20;
revealSound.volume = 0.20;

const drawCardBtn = document.getElementById("drawCardBtn");
const drawCounter = document.getElementById("drawCounter");
const drawTheme = document.getElementById("drawTheme");

const drawError = document.getElementById("drawError");
const formError = document.getElementById("formError");
const contactPermissionField = document.getElementById("contactPermission");

// ESTADO DAS LEITURAS

const INITIAL_FREE_DRAWS = 2;
const UNLOCKED_DRAWS_LIMIT = 5;

let freeDrawsUsed = 0;
let maxFreeDraws = INITIAL_FREE_DRAWS;
let leadSubmitted = false;

//google forms conexao
const googleFormsUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeAkmIJ7xqdLKkdbch92AozzZgVXKZDba4bmqi09Pfn_ZJQlQ/formResponse";

const THEME_CLASSES = {
  Amor: "amor",
  Carreira: "carreira",
  Espiritualidade: "espiritualidade",
  "Decisões Importantes": "decisoes"
};

drawTheme.addEventListener("change", function () {
  clearFeedback(drawError);
  drawTheme.removeAttribute("aria-invalid");

  cardShuffle.classList.remove(
    "amor",
    "carreira",
    "espiritualidade",
    "decisoes"
  );

  const selectedThemeClass = THEME_CLASSES[drawTheme.value];

  if (selectedThemeClass) {
    cardShuffle.classList.add(selectedThemeClass);
  }
});

function playSound(audio) {
  audio.currentTime = 0;

  audio.play().catch(function () {
    // O navegador pode bloquear ou falhar ao reproduzir.
  });
}

function stopSound(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function showFeedback(element, message) {
  element.textContent = message;
  element.classList.add("show");
}

function clearFeedback(element) {
  element.textContent = "";
  element.classList.remove("show");
}

contactPermissionField.addEventListener("change", function () {
  if (contactPermissionField.checked) {
    clearFeedback(formError);
    contactPermissionField.removeAttribute("aria-invalid");
  }
});

function startCardDraw() {

  const temaEscolhido = drawTheme.value;

  playSound(shuffleSound);

  drawCardBtn.disabled = true;
  drawCardBtn.textContent = "Embaralhando...";  

  cardShuffle.classList.remove("reveal");

  shuffleCards.forEach(function (card) {
    card.classList.remove("revealed");
  });

  cardShuffle.classList.add("shuffle");

  setTimeout(function() {

    cardShuffle.classList.remove("shuffle");
    cardShuffle.classList.add("flash");

    setTimeout(function() {

      cardShuffle.classList.remove("flash");
      cardShuffle.classList.add("reveal");

      stopSound(shuffleSound);
      playSound(revealSound);

      const mensagemFinal =
        getRandomMessageByTheme(temaEscolhido);

      shuffleCards[1].classList.add("revealed");
      cardMessage.textContent = mensagemFinal;

      freeDrawsUsed++;
      updateDrawCounter();

      drawCardBtn.disabled = false;
      drawCardBtn.textContent =
        "Embaralhar e revelar nova mensagem";

    }, 300);

  }, 2500);

}


drawCardBtn.addEventListener("click", function() {
  if (!drawTheme.value) {
    showFeedback(
      drawError,
      "Escolha um tema antes de revelar sua carta."
    );

    drawTheme.setAttribute("aria-invalid", "true");
    drawTheme.focus();

    return;
  }

  clearFeedback(drawError);
  drawTheme.removeAttribute("aria-invalid");

  if (freeDrawsUsed >= maxFreeDraws) {
  if (!leadSubmitted) {
    drawCounter.textContent =
      "Para continuar sua leitura, preencha o formulário abaixo.";

      form.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } else {
      drawCounter.textContent =
        "Você usou suas mensagens liberadas. Fale pelo WhatsApp para aprofundar sua leitura.";

      formSuccess.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    return;
  }

  startCardDraw();
});

function getRandomMessageByTheme(tema) {
  const mensagensDoTema = mensagens[tema];

  if (!mensagensDoTema?.length) {
    return "Respire fundo. Uma nova percepção pode surgir quando você observa a situação com calma.";
  }

  const randomIndex = Math.floor(
    Math.random() * mensagensDoTema.length
  );

  return mensagensDoTema[randomIndex];
}

function updateDrawCounter() {
  const remainingDraws = maxFreeDraws - freeDrawsUsed;
  const messageLabel =
  remainingDraws === 1
    ? "mensagem disponível"
    : "mensagens disponíveis";

  if (remainingDraws > 0) {
    drawCounter.textContent =
      `Você ainda tem ${remainingDraws} ${messageLabel}.`;
    return;
  }

  if (!leadSubmitted) {
    drawCounter.textContent =
      "Você usou suas mensagens gratuitas. Para continuar, preencha o formulário abaixo.";
  } else {
    drawCounter.textContent =
      "Você usou suas mensagens liberadas. Se desejar, fale pelo WhatsApp para aprofundar sua leitura.";
  }
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();
  clearFeedback(formError);
  contactPermissionField.removeAttribute("aria-invalid");

  formSubmitButton.disabled = true;
  formSubmitButton.textContent = "Enviando...";

  const name = document.getElementById("name").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const email = document.getElementById("email").value.trim();
  const contactTime = document.getElementById("contactTime").value;
  const contactPermission = document.getElementById("contactPermission").checked;
  
  if (!contactPermission) {
    showFeedback(
      formError,
      "Marque a autorização de contato para continuar."
    );

    contactPermissionField.setAttribute(
      "aria-invalid",
      "true"
    );

    contactPermissionField.focus();

    formSubmitButton.disabled = false;
    formSubmitButton.textContent =
    "Enviar e liberar novas mensagens";

    return;
  }
  
  const lead = {
    nome: name,
    whatsapp: whatsapp,
    email: email,    
    melhorHorario: contactTime
  };

  try {
    await sendLeadToGoogleForms(lead);

    leadSubmitted = true;
    maxFreeDraws = UNLOCKED_DRAWS_LIMIT;

    updateDrawCounter();

    form.reset();
    form.classList.add("submitted");
    formSuccess.classList.add("show");

    setTimeout(function () {
      formSuccess.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      formSuccess.focus();
      }, 150);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

      showFeedback(
        formError,
        "Não foi possível enviar seus dados. Verifique sua conexão e tente novamente."
      );

      formSubmitButton.disabled = false;
      formSubmitButton.textContent =
        "Enviar e liberar novas mensagens";
    }
});

function sendLeadToGoogleForms(lead) {
  const formData = new FormData();

  formData.append("entry.1375783715", lead.nome);
  formData.append("entry.1946200012", lead.whatsapp);
  formData.append("entry.1515234327", lead.email);  
  formData.append("entry.1924634358", lead.melhorHorario);

  return fetch(googleFormsUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

// CARROSSEL DE CREDIBILIDADE

const phoneCarousel = document.getElementById("phoneCarousel");
const communitySlides = document.querySelectorAll(
  ".phone-slides .slide"
);

const carouselDots = document.querySelectorAll(".carousel-dot");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");
const carouselCaption = document.getElementById("carouselCaption");

const carouselCaptions = [
  "YouTube: anos de conteúdo e uma comunidade com milhares de inscritos.",
  "Mensagens, comentários e interações reais de quem acompanha o trabalho.",
  "Consulta de Tarot online, com atendimento de onde você estiver.",
  "Contato direto pelo WhatsApp para agendamento e atendimento individual."
];

let currentSlide = 0;
let autoplayId = null;

const autoplayDelay = 5000;
const interactionPause = 8000;

let interactionTimeoutId = null;

let pointerStartX = 0;
let pointerCurrentX = 0;
let isDraggingCarousel = false;

function showCommunitySlide(newIndex, direction = 1) {
  const totalSlides = communitySlides.length;

  if (newIndex < 0) {
    newIndex = totalSlides - 1;
  }

  if (newIndex >= totalSlides) {
    newIndex = 0;
  }

  communitySlides.forEach(function(slide, index) {
    slide.classList.remove("active", "previous");

    if (index === currentSlide && direction < 0) {
      slide.classList.add("previous");
    }
  });

  carouselDots.forEach(function(dot) {
    dot.classList.remove("active");
  });

  currentSlide = newIndex;

  communitySlides[currentSlide].classList.add("active");
  carouselDots[currentSlide].classList.add("active");

  carouselCaption.textContent =
    carouselCaptions[currentSlide];
}

function showNextCommunitySlide() {
  showCommunitySlide(currentSlide + 1, 1);
}

function showPreviousCommunitySlide() {
  showCommunitySlide(currentSlide - 1, -1);
}

function startCarouselAutoplay() {
  stopCarouselAutoplay();

  autoplayId = setInterval(function() {
    showNextCommunitySlide();
  }, autoplayDelay);
}

function stopCarouselAutoplay() {
  if (autoplayId) {
    clearInterval(autoplayId);
    autoplayId = null;
  }
}

function pauseAutoplayAfterInteraction() {
  stopCarouselAutoplay();

  clearTimeout(interactionTimeoutId);

  interactionTimeoutId = setTimeout(function() {
    startCarouselAutoplay();
  }, interactionPause);
}

carouselNext.addEventListener("click", function() {
  showNextCommunitySlide();
  pauseAutoplayAfterInteraction();
});

carouselPrev.addEventListener("click", function() {
  showPreviousCommunitySlide();
  pauseAutoplayAfterInteraction();
});

carouselDots.forEach(function(dot) {
  dot.addEventListener("click", function() {
    const targetSlide = Number(dot.dataset.slide);
    const direction = targetSlide > currentSlide ? 1 : -1;

    showCommunitySlide(targetSlide, direction);
    pauseAutoplayAfterInteraction();
  });
});

// Swipe no celular e arraste com mouse

phoneCarousel.addEventListener("pointerdown", function(event) {
  pointerStartX = event.clientX;
  pointerCurrentX = event.clientX;
  isDraggingCarousel = true;

  phoneCarousel.classList.add("dragging");
  phoneCarousel.setPointerCapture(event.pointerId);

  stopCarouselAutoplay();
});

phoneCarousel.addEventListener("pointermove", function(event) {
  if (!isDraggingCarousel) {
    return;
  }

  pointerCurrentX = event.clientX;
});

phoneCarousel.addEventListener("pointerup", function(event) {
  if (!isDraggingCarousel) {
    return;
  }

  const movementX = pointerCurrentX - pointerStartX;
  const minimumSwipeDistance = 45;

  if (movementX <= -minimumSwipeDistance) {
    showNextCommunitySlide();
  } else if (movementX >= minimumSwipeDistance) {
    showPreviousCommunitySlide();
  }

  isDraggingCarousel = false;
  phoneCarousel.classList.remove("dragging");

  if (phoneCarousel.hasPointerCapture(event.pointerId)) {
    phoneCarousel.releasePointerCapture(event.pointerId);
  }

  pauseAutoplayAfterInteraction();
});

phoneCarousel.addEventListener("pointercancel", function() {
  isDraggingCarousel = false;
  phoneCarousel.classList.remove("dragging");

  pauseAutoplayAfterInteraction();
});

// Pausa enquanto o usuário observa com o mouse

phoneCarousel.addEventListener("mouseenter", function() {
  stopCarouselAutoplay();
});

phoneCarousel.addEventListener("mouseleave", function() {
  if (!isDraggingCarousel) {
    startCarouselAutoplay();
  }
});

// Evita trocar slides enquanto a aba estiver escondida

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    stopCarouselAutoplay();
  } else {
    startCarouselAutoplay();
  }
});

showCommunitySlide(0);
startCarouselAutoplay();