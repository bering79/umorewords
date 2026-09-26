const selected = new Set();

const situationData = {
  presentation: {
    title: "Мне предстоит выступление",
    text: "Давай начнём с короткого маршрута: понять, что тебя пугает, подготовить одну точку опоры и решить, к чему вернуться, если во время выступления станет трудно."
  },
  phone: {
    title: "Мне страшно звонить",
    text: "Начнём с ситуации, которая пугает тебя сейчас: что именно ты ожидаешь от разговора и что хочешь сказать."
  },
  school: {
    title: "Мне трудно в школе",
    text: "Можно отдельно разобраться с ответами, чтением вслух и разговорами в классе. Начнём с конкретной ситуации, а не с оценки тебя самого."
  },
  meeting: {
    title: "Мне трудно знакомиться",
    text: "Посмотрим не только на страх речи, но и на то, что ты хочешь получить от знакомства и разговора."
  },
  bullying: {
    title: "Надо мной смеются",
    text: "Здесь не будет задания «справься сам». Сначала разберём, что происходит и к кому можно обратиться за поддержкой."
  },
  alone: {
    title: "Мне кажется, что я один",
    text: "Начнём не с исправления. Сначала — с ощущения, что твой опыт не уникален и тебе не обязательно сразу что-то менять."
  },
  future: {
    title: "Я думаю о будущем",
    text: "Разберём реальные вопросы об учёбе, работе, друзьях и выступлениях — без обещаний и без мысли, что заикание заранее определяет твою жизнь."
  },
  "understand-me": {
    title: "Я не понимаю, что со мной",
    text: "Можно начать с базового объяснения: что такое заикание, почему оно меняется и как на жизнь могут влиять страх и избегание."
  }
};

const grid = document.getElementById("situation-grid");
const action = document.getElementById("situation-action");
const count = document.getElementById("selection-count");
const recommendation = document.getElementById("recommendation");
const recTitle = document.getElementById("recommendation-title");
const recText = document.getElementById("recommendation-text");
const recLink = document.getElementById("recommendation-link");
const chooseAgain = document.getElementById("choose-again");

grid?.addEventListener("click", (event) => {
  const card = event.target.closest(".situation-card");
  if (!card) return;

  const id = card.dataset.id;
  if (selected.has(id)) {
    selected.delete(id);
    card.classList.remove("selected");
    card.setAttribute("aria-pressed", "false");
  } else {
    selected.add(id);
    card.classList.add("selected");
    card.setAttribute("aria-pressed", "true");
  }

  count.textContent = selected.size;
  action.hidden = selected.size === 0;
  recommendation.hidden = true;
});

document.querySelectorAll(".situation-card").forEach(card => {
  card.setAttribute("aria-pressed", "false");
});

document.getElementById("start-situation")?.addEventListener("click", () => {
  const firstId = [...selected][0];
  const data = situationData[firstId] || situationData.presentation;

  recTitle.textContent = data.title;
  recText.textContent = data.text;

  if (firstId === "presentation") {
    recLink.textContent = "Открыть маршрут →";
    recLink.href = "#presentation-route";
  } else {
    recLink.textContent = "Открыть раздел →";
    recLink.href = "#understand";
  }

  recommendation.hidden = false;
  recommendation.scrollIntoView({ behavior: "smooth", block: "center" });
});

chooseAgain?.addEventListener("click", () => {
  recommendation.hidden = true;
  document.getElementById("difficult").scrollIntoView({ behavior: "smooth" });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("save-step")?.addEventListener("click", () => {
  localStorage.setItem("ne-tolko-rech-small-step", "Что я хочу сказать этому человеку?");
  document.getElementById("save-message").textContent = "Сохранено на этом устройстве.";
});

const route = document.getElementById("presentation-route");
const routeContent = document.getElementById("route-content");
const routeProgress = document.querySelector(".route-progress span");
const routeClose = document.querySelector(".route-close");

const routeState = {
  step: 0,
  topic: "",
  mainPoint: "",
  supports: [],
  fallback: ""
};

const steps = [
  {
    type: "text",
    title: "О чём тебе предстоит говорить?",
    text: "Напиши тему так, как ты сам её называешь. Не нужно формулировать красиво.",
    placeholder: "Например: мой проект по биологии",
    key: "topic",
    max: 120
  },
  {
    type: "text",
    title: "Что ты хочешь, чтобы люди поняли?",
    text: "Представь, что после выступления тебя спрашивают: «А что главное ты хотел рассказать?»",
    placeholder: "Например: я хочу показать, почему сон важен для подростков",
    key: "mainPoint",
    max: 240
  },
  {
    type: "options",
    title: "К чему ты сможешь вернуться, если станет трудно?",
    text: "Выбери то, что может стать для тебя опорой. Можно выбрать несколько вариантов.",
    options: [
      ["plan", "Мой план", "Посмотреть на несколько основных пунктов."],
      ["mainPoint", "Главная мысль", "Вспомнить, что именно я хочу донести."],
      ["slide", "Слайд", "Посмотреть на текущий слайд и продолжить с него."],
      ["pause", "Небольшая пауза", "Остановиться, посмотреть в план и продолжить."],
    ]
  },
  {
    type: "text",
    title: "Если во время выступления станет трудно — что ты всё равно хочешь сказать?",
    text: "Пусть речь сейчас будет неидеальной. Что тебе важно донести?",
    placeholder: "Например: почему важно высыпаться",
    key: "fallback",
    max: 240
  }
];

function openRoute() {
  route.classList.add("open");
  document.body.classList.add("route-open");
  routeState.step = 0;
  renderRouteStep();
  history.pushState({ route: true }, "", "#presentation-route");
}

function closeRoute() {
  route.classList.remove("open");
  document.body.classList.remove("route-open");
  if (location.hash === "#presentation-route") {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}

function renderRouteStep() {
  const step = steps[routeState.step];
  const percent = ((routeState.step + 1) / (steps.length + 1)) * 100;
  routeProgress.style.width = `${percent}%`;

  if (step.type === "text") {
    const value = routeState[step.key] || "";
    routeContent.innerHTML = `
      <h2 id="route-title">${step.title}</h2>
      <p>${step.text}</p>
      <label class="sr-only" for="route-input">Ваш ответ</label>
      <textarea id="route-input" class="route-input" maxlength="${step.max}" placeholder="${step.placeholder}">${escapeHtml(value)}</textarea>
      <div class="route-actions">
        <button class="btn btn-secondary" type="button" data-route-back ${routeState.step === 0 ? "hidden" : ""}>← Назад</button>
        <button class="btn btn-primary" type="button" data-route-next>Дальше →</button>
      </div>
      <p class="route-note">Не нужно писать идеально. Здесь нет правильного ответа.</p>
    `;
    document.getElementById("route-input").focus();
  } else if (step.type === "options") {
    routeContent.innerHTML = `
      <h2 id="route-title">${step.title}</h2>
      <p>${step.text}</p>
      <div class="route-options">
        ${step.options.map(([id, title, desc]) => `
          <label class="route-option ${routeState.supports.includes(id) ? "selected" : ""}">
            <input type="checkbox" value="${id}" ${routeState.supports.includes(id) ? "checked" : ""}>
            <span><strong>${title}</strong><small>${desc}</small></span>
          </label>
        `).join("")}
      </div>
      <div class="route-actions">
        <button class="btn btn-secondary" type="button" data-route-back>← Назад</button>
        <button class="btn btn-primary" type="button" data-route-next>Дальше →</button>
      </div>
    `;
    routeContent.querySelectorAll(".route-option").forEach(option => {
      option.addEventListener("change", () => option.classList.toggle("selected", option.querySelector("input").checked));
    });
  } else {
    renderSummary();
  }

  routeContent.querySelector("[data-route-next]")?.addEventListener("click", nextRouteStep);
  routeContent.querySelector("[data-route-back]")?.addEventListener("click", previousRouteStep);
}

function nextRouteStep() {
  const step = steps[routeState.step];
  if (step.type === "text") {
    const input = document.getElementById("route-input");
    routeState[step.key] = input.value.trim();
  } else if (step.type === "options") {
    routeState.supports = [...routeContent.querySelectorAll("input:checked")].map(input => input.value);
  }

  if (routeState.step < steps.length - 1) {
    routeState.step += 1;
    renderRouteStep();
  } else {
    renderSummary();
  }
}

function previousRouteStep() {
  if (routeState.step > 0) {
    routeState.step -= 1;
    renderRouteStep();
  }
}

function renderSummary() {
  routeState.step = steps.length;
  routeProgress.style.width = "100%";

  const supportLabels = {
    plan: "Посмотреть на план",
    mainPoint: "Вспомнить главную мысль",
    slide: "Посмотреть на слайд",
    pause: "Сделать небольшую паузу"
  };

  const supports = routeState.supports.length
    ? routeState.supports.map(id => supportLabels[id]).join("<br>")
    : "Выбрать то, к чему тебе удобно вернуться";

  routeContent.innerHTML = `
    <p class="eyebrow">ГОТОВО</p>
    <h2 id="route-title">Теперь у тебя есть точка опоры.</h2>
    <p>Завтра тебе не обязательно говорить идеально. Ты можешь волноваться, заикаться, потерять мысль и найти её снова — и всё равно продолжать говорить о том, что тебе важно.</p>
    <div class="route-summary">
      <dl>
        <dt>МОЯ ТЕМА</dt>
        <dd>${escapeHtml(routeState.topic || "Не указана")}</dd>
        <dt>ГЛАВНОЕ</dt>
        <dd>${escapeHtml(routeState.mainPoint || "Ты можешь определить это по ходу выступления")}</dd>
        <dt>ЕСЛИ СТАНЕТ ТРУДНО</dt>
        <dd>${supports}</dd>
        <dt>Я ВСЁ РАВНО ХОЧУ СКАЗАТЬ</dt>
        <dd>${escapeHtml(routeState.fallback || "То, что для меня важно")}</dd>
      </dl>
    </div>
    <div class="route-actions">
      <button class="btn btn-secondary" type="button" data-route-back>← Изменить</button>
      <button class="btn btn-primary" type="button" data-route-finish>Готово →</button>
    </div>
    <p class="route-note">Это не обязательная подготовка и не способ контролировать заикание. Это просто одна из возможных точек опоры.</p>
  `;
  routeContent.querySelector("[data-route-back]")?.addEventListener("click", () => {
    routeState.step = steps.length - 1;
    renderRouteStep();
  });
  routeContent.querySelector("[data-route-finish]")?.addEventListener("click", () => {
    localStorage.setItem("ne-tolko-rech-presentation", JSON.stringify(routeState));
    closeRoute();
    document.getElementById("presentation-route").scrollIntoView({ behavior: "smooth" });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

document.getElementById("recommendation-link")?.addEventListener("click", (event) => {
  if (event.currentTarget.getAttribute("href") === "#presentation-route") {
    event.preventDefault();
    openRoute();
  }
});

routeClose?.addEventListener("click", closeRoute);
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && route.classList.contains("open")) closeRoute();
});
window.addEventListener("popstate", () => {
  if (!location.hash.includes("presentation-route")) {
    route.classList.remove("open");
    document.body.classList.remove("route-open");
  }
});
