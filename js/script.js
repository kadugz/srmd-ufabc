/* =========================================================
   SRMD — interações de front-end (sem backend / sem persistência em servidor)
   ========================================================= */
(function () {
  "use strict";

  var html = document.documentElement;

  /* ---------- Preferências (tamanho de fonte / alto contraste) ---------- */
  function applyStoredPrefs() {
    var size = localStorage.getItem("srmd-fontsize") || "100";
    var contrast = localStorage.getItem("srmd-contrast") || "normal";
    html.setAttribute("data-fontsize", size);
    if (contrast === "high") html.setAttribute("data-contrast", "high");

    document.querySelectorAll(".fontsize-btn").forEach(function (btn) {
      var pressed = btn.getAttribute("data-size") === size;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
    var contrastBtn = document.getElementById("contrast-toggle");
    if (contrastBtn) contrastBtn.setAttribute("aria-pressed", contrast === "high" ? "true" : "false");
  }

  document.querySelectorAll(".fontsize-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var size = btn.getAttribute("data-size");
      localStorage.setItem("srmd-fontsize", size);
      applyStoredPrefs();
    });
  });

  var contrastToggle = document.getElementById("contrast-toggle");
  if (contrastToggle) {
    contrastToggle.addEventListener("click", function () {
      var isHigh = html.getAttribute("data-contrast") === "high";
      localStorage.setItem("srmd-contrast", isHigh ? "normal" : "high");
      applyStoredPrefs();
    });
  }

  applyStoredPrefs();

  /* ---------- Áudio-descrição textual (lê em voz alta a síntese acessível) ---------- */
  var audioBtn = document.getElementById("audio-toggle");
  if (audioBtn) {
    audioBtn.addEventListener("click", function () {
      var target = document.querySelector("[data-readaloud]");
      if (!("speechSynthesis" in window) || !target) {
        audioBtn.setAttribute("aria-pressed", "true");
        window.setTimeout(function () { audioBtn.setAttribute("aria-pressed", "false"); }, 400);
        return;
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        audioBtn.setAttribute("aria-pressed", "false");
        return;
      }
      var utterance = new SpeechSynthesisUtterance(target.textContent.trim());
      utterance.lang = "pt-BR";
      utterance.onend = function () { audioBtn.setAttribute("aria-pressed", "false"); };
      audioBtn.setAttribute("aria-pressed", "true");
      window.speechSynthesis.speak(utterance);
    });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Alternância Grafo / Lista (grafo.html) ---------- */
  var viewButtons = document.querySelectorAll(".view-toggle button");
  if (viewButtons.length) {
    viewButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetView = btn.getAttribute("data-view");
        viewButtons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        document.querySelectorAll(".graph-wrap, .list-view").forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-panel") !== targetView;
        });
      });
    });
  }

  /* Botão "Focar EDAA" devolve o foco ao nó em destaque */
  var focusBtn = document.querySelector("[data-focus-node]");
  if (focusBtn) {
    focusBtn.addEventListener("click", function () {
      var node = document.querySelector(".node.is-foco");
      if (node) {
        node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        node.focus();
      }
    });
  }

  /* ---------- Minha Grade: adicionar/remover disciplinas cursadas ---------- */
  var chipForm = document.getElementById("add-course-form");
  var chipList = document.getElementById("course-chip-list");
  var chipInput = document.getElementById("course-input");
  var clearHistoryBtn = document.getElementById("clear-history");
  var STORAGE_KEY = "srmd-historico-local";

  function renderChips() {
    if (!chipList) return;
    var courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    chipList.innerHTML = "";
    if (courses.length === 0) {
      var empty = document.createElement("li");
      empty.className = "chip-empty";
      empty.textContent = "Nenhuma disciplina adicionada ainda.";
      chipList.appendChild(empty);
      return;
    }
    courses.forEach(function (course, index) {
      var li = document.createElement("li");
      li.className = "chip";
      var span = document.createElement("span");
      span.textContent = course;
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remover " + course + " da lista de cursadas");
      removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      removeBtn.addEventListener("click", function () {
        courses.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        renderChips();
      });
      li.appendChild(span);
      li.appendChild(removeBtn);
      chipList.appendChild(li);
    });
  }

  if (chipForm) {
    renderChips();
    chipForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (chipInput.value || "").trim();
      if (!value) return;
      var courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      courses.push(value);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      chipInput.value = "";
      chipInput.focus();
      renderChips();
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      renderChips();
    });
  }

  /* ---------- Recomendações: aceitar / ignorar (apenas visual, sem envio) ---------- */
  document.querySelectorAll(".reco-card").forEach(function (card) {
    var acceptBtn = card.querySelector("[data-accept]");
    var ignoreBtn = card.querySelector("[data-ignore]");
    if (acceptBtn) acceptBtn.addEventListener("click", function () {
      card.classList.add("is-accepted");
      card.classList.remove("is-ignored");
    });
    if (ignoreBtn) ignoreBtn.addEventListener("click", function () {
      card.classList.add("is-ignored");
      card.classList.remove("is-accepted");
    });
  });

  /* ---------- Biblioteca: filtros de disponibilidade (apenas front) ---------- */
  var filterChips = document.querySelectorAll(".filter-chip");
  var biblioCards = document.querySelectorAll("[data-formats]");
  if (filterChips.length && biblioCards.length) {
    filterChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var active = chip.getAttribute("aria-pressed") === "true";
        filterChips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        if (!active) chip.setAttribute("aria-pressed", "true");
        var current = Array.from(filterChips).find(function (c) { return c.getAttribute("aria-pressed") === "true"; });
        var filter = current ? current.getAttribute("data-filter") : "todos";
        biblioCards.forEach(function (card) {
          var formats = card.getAttribute("data-formats");
          card.hidden = filter !== "todos" && formats.indexOf(filter) === -1;
        });
      });
    });
  }
})();
