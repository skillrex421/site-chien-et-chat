/**
 * ==========================================================================
 * PAWWORLD - ARCHITECTURE JAVASCRIPT ET CAPACITÉS INTERACTIVES COMPLETE
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --- INITIALISATION DES MODULES GLOBAUX ---
  initLoader();
  initCustomCursor();
  initNavbarScroll();
  initScrollReveal();
  initTabsBreeds();
  initTabsHealthcare();
  initQuizEngine();
  initInfiniteMarqueePause();
  initNewsletterValidation();
  initBackToTop();
});

/**
 * 1. SIMULATION ET EFFET DE CHARGEMENT DE LA PAGE (LOADER)
 * Gère la jauge de progression et l'effacement fluide du rideau d'accueil.
 */
function initLoader() {
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".loader-progress");
  
  if (!loader || !progressBar) return;

  let progress = 0;
  // Vitesse de chargement pseudo-aléatoire pour faire plus naturel
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Petit délai pour laisser l'utilisateur voir la jauge pleine
      setTimeout(() => {
        loader.classList.add("loaded");
        document.body.style.overflowY = "auto"; // Débloque le scroll
      }, 400);
    }
    
    progressBar.style.width = `${progress}%`;
  }, 80);
}

/**
 * 2. EFFET DE CURSEUR PERSO INTERACTIF ET DYNAMIQUE
 * Calcule l'inertie du curseur suiveur et change de style selon les zones.
 */
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;     // Position réelle de la souris
  let followerX = 0, followerY = 0; // Position calculée du suiveur (avec inertie)

  // Suivi des mouvements de la souris
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
  });

  // Boucle d'animation fluide pour le suiveur (Lerp approximation)
  function renderFollower() {
    // Ajuster le coefficient (0.1) pour modifier l'inertie (plus bas = plus lent)
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    
    follower.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Détection des survols thématiques (Chiens vs Chats vs Liens)
  const catSection = document.getElementById("chats");
  const dogSection = document.getElementById("chiens");
  const interactives = document.querySelectorAll("a, button, .tab-btn, .soin-tab, .quiz-answer-btn");

  if (catSection) {
    catSection.addEventListener("mouseenter", () => document.body.classList.remove("hover-dog"));
  }
  if (dogSection) {
    dogSection.addEventListener("mouseenter", () => document.body.classList.add("hover-dog"));
  }

  interactives.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursor.style.transform += " scale(2.5)";
      follower.style.transform += " scale(0.5)";
      follower.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });
    item.addEventListener("mouseleave", () => {
      cursor.style.transform = cursor.style.transform.replace(" scale(2.5)", "");
      follower.style.transform = follower.style.transform.replace(" scale(0.5)", "");
      follower.style.backgroundColor = "transparent";
    });
  });
}

/**
 * 3. COMPORTEMENT DE LA NAV BAR AU SCROLL
 * Ajoute un effet d'ombre et réduit la hauteur de la barre lors du défilement.
 */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/**
 * 4. EFFET DE REVEAL (INTERSECTION OBSERVER)
 * Fait apparaître les éléments de manière asynchrone dès qu'ils entrent dans l'écran.
 */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(".reveal, .about-text, .about-gallery, .behavior-card, .race-card, .soin-card");
  
  if (elementsToReveal.length === 0) return;

  // Configuration de l'observateur (se déclenche quand 15% de l'objet est visible)
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // On arrête d'observer une fois affiché pour optimiser les performances
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach((el) => {
    el.classList.add("reveal"); // Injecte dynamiquement la classe de base CSS si absente
    revealObserver.observe(el);
  });
}

/**
 * 5. SYSTEME D'ONGLETS DE L'ENCYCLOPÉDIE DES RACES
 * Filtre et permute l'affichage entre les races de chats et de chiens.
 */
function initTabsBreeds() {
  const tabButtons = document.querySelectorAll(".tabs-header .tab-btn");
  const tabContents = document.querySelectorAll(".tabs-container .tab-content");

  if (tabButtons.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");

      // Nettoyer les états actifs sur les boutons
      tabButtons.forEach((b) => b.classList.remove("active"));
      // Nettoyer les états actifs sur les contenus
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activer les bons éléments
      btn.classList.add("active");
      const activeContent = document.getElementById(targetId);
      if (activeContent) {
        activeContent.classList.add("active");
        
        // Relancer l'animation des barres de statistiques à l'intérieur
        const fills = activeContent.querySelectorAll(".bar-fill");
        fills.forEach(fill => {
          const targetWidth = fill.style.getPropertyValue("--w") || "80%";
          fill.style.width = "0%";
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 100);
        });
      }
    });
  });
}

/**
 * 6. SYSTEME D'ONGLETS POUR LA SECTION SOINS ET VÉTÉRINAIRE
 * Alterne entre les conseils généraux, l'alimentation et la santé.
 */
function initTabsHealthcare() {
  const soinTabs = document.querySelectorAll(".soins-tabs .soin-tab");
  const soinPanels = document.querySelectorAll(".soins-content .soin-panel");

  if (soinTabs.length === 0) return;

  soinTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetPanelId = tab.getAttribute("data-soin");

      soinTabs.forEach((t) => t.classList.remove("active"));
      soinPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const activePanel = document.getElementById(targetPanelId);
      if (activePanel) {
        activePanel.classList.add("active");
      }
    });
  });
}

/**
 * 7. MOTEUR INTERACTIF DU QUIZ COMPLET (GAMIFICATION)
 * Base de données des questions, gestion des étapes, calcul du score et écran de fin.
 */
function initQuizEngine() {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  // Banque de données des questions du Quiz
  const quizData = [
    {
      question: "Quel est le sens le plus développé chez le chien ?",
      answers: ["La vue", "L'odorat", "L'ouïe", "Le goût"],
      correct: 1,
      explanation: "L'odorat du chien est jusqu'à 100 000 fois plus puissant que celui de l'homme !"
    },
    {
      question: "Pourquoi les chats ronronnent-ils en général ?",
      answers: ["Uniquement pour exprimer le bonheur", "Pour nettoyer leurs dents", "Pour apaiser la douleur ou communiquer", "Pour chasser les souris"],
      correct: 2,
      explanation: "Le ronronnement exprime le bien-être, mais sert aussi à s'auto-apaiser en cas de stress ou douleur."
    },
    {
      question: "Quel aliment parmi ceux-là est extrêmement toxique pour les chiens et chats ?",
      answers: ["La pomme", "Le chocolat", "Le riz cuit", "La courgette"],
      correct: 1,
      explanation: "Le chocolat contient de la théobromine, une molécule que leur métabolisme ne peut pas éliminer."
    },
    {
      question: "Combien d'heures par jour un chat adulte dort-il en moyenne ?",
      answers: ["Entre 5h et 8h", "Entre 8h et 12h", "Entre 12h et 16h", "Plus de 20h"],
      correct: 2,
      explanation: "Les chats sont de grands prédateurs de canapé et dorment environ les deux tiers de leur vie !"
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  function renderQuestion() {
    const data = quizData[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;

    // Structure HTML interne du quiz mise à jour dynamiquement
    quizContainer.innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="position:relative; width:100%;">
          <div class="quiz-actual-progress" style="height:100%; width:${progressPercent}%; background-color:var(--clr-quiz); border-radius:var(--radius-full); transition: width 0.4s ease;"></div>
        </div>
        <p class="quiz-progress-text">Question ${currentQuestionIndex + 1} sur ${quizData.length}</p>
      </div>
      <h3 class="quiz-question">${data.question}</h3>
      <div class="quiz-answers" id="quizAnswersBlock"></div>
    `;

    const answersBlock = document.getElementById("quizAnswersBlock");
    
    // Génération des boutons de réponses
    data.answers.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.className = "quiz-answer-btn";
      btn.innerText = answer;
      btn.addEventListener("click", () => checkAnswer(index, btn));
      answersBlock.appendChild(btn);
    });
  }

  function checkAnswer(selectedIndex, clickedBtn) {
    const data = quizData[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".quiz-answer-btn");
    
    // Désactiver tous les boutons après le clic pour éviter les doublons
    allButtons.forEach(btn => btn.style.pointerEvents = "none");

    if (selectedIndex === data.correct) {
      score++;
      clickedBtn.style.backgroundColor = "rgba(74, 214, 109, 0.2)";
      clickedBtn.style.borderColor = "var(--clr-health)";
    } else {
      clickedBtn.style.backgroundColor = "rgba(230, 57, 70, 0.2)";
      clickedBtn.style.borderColor = "var(--clr-danger)";
      // Montrer la bonne réponse en vert
      allButtons[data.correct].style.backgroundColor = "rgba(74, 214, 109, 0.1)";
      allButtons[data.correct].style.borderColor = "var(--clr-health)";
    }

    // Affichage d'un petit encart d'explication pédagogique
    const explanationDiv = document.createElement("p");
    explanationDiv.className = "quiz-explanation-text";
    explanationDiv.style.cssText = "margin-top: 1.5rem; font-style: italic; color: var(--clr-text-muted); font-size: 0.95rem; animation: reveal 0.3s ease;";
    explanationDiv.innerHTML = `💡 <strong>Le saviez-vous ?</strong> ${data.explanation}`;
    quizContainer.appendChild(explanationDiv);

    // Passage à la question suivante après un petit délai de lecture
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        renderQuestion();
      } else {
        renderResults();
      }
    }, 3500);
  }

  function renderResults() {
    let title, emoji, message;

    if (score === quizData.length) {
      title = "Expert Absolu !";
      emoji = "👑";
      message = "Parfait ! Vous connaissez nos compagnons à quatre pattes sur le bout des doigts.";
    } else if (score >= quizData.length / 2) {
      title = "Excellent passionné !";
      emoji = "🐾";
      message = "Beau score ! Vous avez de solides connaissances sur les animaux de compagnie.";
    } else {
      title = "Novice curieux !";
      emoji = "🐱";
      message = "C'est un bon début ! Continuez à explorer notre site pour en apprendre plus.";
    }

    quizContainer.innerHTML = `
      <div class="quiz-result animate-reveal">
        <div class="result-emoji">${emoji}</div>
        <h3>${title}</h3>
        <p>Votre score final est de : <strong>${score} / ${quizData.length}</strong></p>
        <p style="font-size: 1rem; color: var(--clr-text-muted); margin-bottom: 2rem;">${message}</p>
        <button class="btn btn-primary" id="btnRestartQuiz">Recommencer le Quiz</button>
      </div>
    `;

    document.getElementById("btnRestartQuiz").addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;
      renderQuestion();
    });
  }

  // Lancement initial du quiz
  renderQuestion();
}

/**
 * 8. MISE EN PAUSE DU DEFILEMENT DES CAROUSELS AU SURVOL
 * Stabilise la lecture des faits insolites lorsque la souris de l'utilisateur s'arrête dessus.
 */
function initInfiniteMarqueePause() {
  const tracks = document.querySelectorAll(".band-track, .facts-track");
  
  tracks.forEach((track) => {
    track.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });
    track.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  });
}

/**
 * 9. FORMULAIRE INTERACTIF DE LA NEWSLETTER
 * Bloque l'envoi classique, vérifie le format et affiche un message de succès personnalisé.
 */
function initNewsletterValidation() {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Annule le rechargement de page
    
    const input = form.querySelector(".newsletter-input");
    const existingMsg = form.parentElement.querySelector(".nl-confirm");
    if (existingMsg) existingMsg.remove(); // Nettoyer l'ancien message si double-clic

    if (!input || input.value.trim() === "") return;

    // RegEx basique de validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const confirmElement = document.createElement("p");

    if (emailRegex.test(input.value.trim())) {
      confirmElement.className = "nl-confirm success-msg";
      confirmElement.style.cssText = "color: var(--clr-health); font-weight: 600; margin-top: 1rem; font-size: 0.95rem;";
      confirmElement.innerText = "🎉 Merci ! Votre inscription à la Gazette PawWorld a été validée avec succès.";
      input.value = ""; // Vider le champ de saisie
    } else {
      confirmElement.className = "nl-confirm error-msg";
      confirmElement.style.cssText = "color: var(--clr-danger); font-weight: 600; margin-top: 1rem; font-size: 0.95rem;";
      confirmElement.innerText = "❌ L'adresse email saisie semble incorrecte ou mal formée.";
    }

    form.parentElement.appendChild(confirmElement);
    
    // Auto-suppression du message après 6 secondes
    setTimeout(() => {
      confirmElement.style.opacity = "0";
      confirmElement.style.transition = "opacity 0.5s ease";
      setTimeout(() => confirmElement.remove(), 500);
    }, 6000);
  });
}

/**
 * 10. BOUTON FLOATING "BACK TO TOP" (RETOUR EN HAUT)
 * Gère son apparition dynamique selon la hauteur de scroll et remonte la page en douceur.
 */
function initBackToTop() {
  // Création dynamique du bouton s'il n'existe pas dans le DOM original
  let backBtn = document.querySelector(".back-top");
  
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.className = "back-top";
    backBtn.innerHTML = "↑";
    backBtn.setAttribute("title", "Retourner en haut de la page");
    document.body.appendChild(backBtn);
  }

  window.addEventListener("scroll", () => {
    // Apparaît après avoir descendu de 400px
    if (window.scrollY > 400) {
      backBtn.classList.add("active");
    } else {
      backBtn.classList.remove("active");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}