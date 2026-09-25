const questions = [
  {
    area: "Relevance",
    icon: "🎯",
    question: "How well did the generated lesson plan match your teaching needs?",
    type: "stars",
    low: "Poor match",
    high: "Perfect match",
  },
  {
    area: "Content Quality",
    icon: "📚",
    question: "How appropriate was the generated content for the selected topic and learner level?",
    type: "emoji",
  },
  {
    area: "Lesson Structure",
    icon: "🧩",
    question: "How well was the lesson organized (objectives, activities, assessment, etc.)?",
    type: "stars",
    low: "Unclear",
    high: "Very organized",
  },
  {
    area: "Customization",
    icon: "✏️",
    question: "How easy was it to adapt the lesson plan to your classroom needs?",
    type: "scale",
    low: "Very Difficult",
    high: "Very Easy",
  },
  {
    area: "Teaching Support",
    icon: "💡",
    question: "Did the assistant give you useful ideas or activities you could use in class?",
    type: "scale",
    low: "Not Useful",
    high: "Very Useful",
  },
  {
    area: "Time Saving",
    icon: "⏱️",
    question: "Would this assistant reduce the time you spend preparing lesson plans?",
    type: "scale",
    low: "Not at all",
    high: "Significantly",
  },
  {
    area: "AI Output Confidence",
    icon: "🤖",
    question: "How confident would you feel using the generated lesson plan after reviewing it?",
    type: "scale",
    low: "Not Confident",
    high: "Very Confident",
  },
  {
    area: "Teacher Control",
    icon: "👩‍🏫",
    question: "Did you feel you had enough control to modify the AI-generated plan?",
    type: "scale",
    low: "Not Enough",
    high: "Complete Control",
  },
  {
    area: "Adoption",
    icon: "🚀",
    question: "Would you use this assistant for future lesson planning?",
    type: "choice",
    options: [
      { label: "No", value: 1, icon: "❌" },
      { label: "Maybe", value: 3, icon: "🤔" },
      { label: "Yes", value: 5, icon: "✅" },
    ],
  },
  {
    area: "Overall Experience",
    icon: "🌟",
    question: "How would you rate your overall experience?",
    type: "stars",
    low: "Poor",
    high: "Excellent",
  },
];

const state = {
  started: false,
  index: 0,
  user: {
    name: "",
    email: "",
    designation: "Teacher",
  },
  answers: Array(questions.length).fill(null),
};

const startCard = document.querySelector("#startCard");
const questionCard = document.querySelector("#questionCard");
const completeCard = document.querySelector("#completeCard");
const registrationForm = document.querySelector("#registrationForm");
const userNameInput = document.querySelector("#userName");
const userEmailInput = document.querySelector("#userEmail");
const userDesignationSelect = document.querySelector("#userDesignation");
const otherDesignationGroup = document.querySelector("#otherDesignationGroup");
const otherDesignationInput = document.querySelector("#otherDesignation");
const formError = document.querySelector("#formError");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const nextButton = document.querySelector("#nextButton");
const backButton = document.querySelector("#backButton");
const againButton = document.querySelector("#againButton");
const downloadButton = document.querySelector("#downloadButton");
const saveDriveButton = document.querySelector("#saveDriveButton");
const areaLabel = document.querySelector("#areaLabel");
const questionText = document.querySelector("#questionText");
const questionNumber = document.querySelector("#questionNumber");
const answerZone = document.querySelector("#answerZone");
const progressWrap = document.querySelector("#progressWrap");
const stepLabel = document.querySelector("#stepLabel");
const percentLabel = document.querySelector("#percentLabel");
const progressFill = document.querySelector("#progressFill");
const questDots = document.querySelector("#questDots");
const summaryGrid = document.querySelector("#summaryGrid");
const completionCopy = document.querySelector("#completionCopy");
const completionTitle = document.querySelector("#completionTitle");
const saveStatus = document.querySelector("#saveStatus");
const visualStage = document.querySelector("#visualStage");
const routeLine = document.querySelector(".route-line");
const traveler = document.querySelector("#traveler");

function initDots() {
  if (!questDots) return;
  questDots.innerHTML = "";
  questions.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "quest-dot";
    dot.dataset.index = index;
    questDots.appendChild(dot);
  });
}

function getAnsweredCount() {
  return state.answers.filter(Boolean).length;
}

function updateProgress() {
  const answered = getAnsweredCount();
  const percent = Math.round((answered / questions.length) * 100);
  stepLabel.textContent = `Question ${Math.min(state.index + 1, questions.length)} of ${questions.length}`;
  percentLabel.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  if (questDots && questDots.children.length > 0) {
    [...questDots.children].forEach((dot, index) => {
      dot.className = "quest-dot";
      if (state.answers[index]) dot.classList.add("is-done");
      if (state.started && index === state.index) dot.classList.add("is-current");
    });
  }
}

const brandSidebar = document.querySelector(".brand-sidebar");

function showOnly(section) {
  [startCard, questionCard, completeCard].forEach((card) => {
    card.classList.toggle("is-hidden", card !== section);
  });
  if (progressWrap) {
    progressWrap.classList.toggle("is-hidden", section !== questionCard);
  }
  if (brandSidebar) {
    brandSidebar.classList.toggle("is-survey-active", section === questionCard);
  }
}

function answerCurrent(answer) {
  state.answers[state.index] = answer;
  if (visualStage) {
    visualStage.classList.remove("is-answering");
    window.requestAnimationFrame(() => {
      visualStage.classList.add("is-answering");
    });
  }
  renderQuestion();
}

function createOption({ label, value, icon, detail }, cssClass = "") {
  const selected = state.answers[state.index]?.value === value;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `option-button ${cssClass} ${selected ? "is-selected" : ""}`;
  button.setAttribute("aria-pressed", String(selected));
  button.innerHTML = `<strong>${icon || label}</strong>${detail ? `<span>${detail}</span>` : ""}`;
  button.addEventListener("click", () => answerCurrent({ label, value }));
  return button;
}

function renderStars(question) {
  const container = document.createElement("div");
  container.className = "scale-wrapper";

  const grid = document.createElement("div");
  grid.className = "option-grid rating-row stars-row";
  [1, 2, 3, 4, 5].forEach((value) => {
    const detailText = value === 1 ? question.low : value === 5 ? question.high : `${value} stars`;
    grid.appendChild(createOption({ label: `${value} ★ (${detailText})`, value, icon: "★".repeat(value), detail: "" }));
  });
  container.appendChild(grid);

  if (question.low || question.high) {
    const legend = document.createElement("div");
    legend.className = "scale-legend";
    legend.innerHTML = `
      <span class="legend-low">1 ★ · ${question.low || ""}</span>
      <span class="legend-high">${question.high || ""} · 5 ★</span>
    `;
    container.appendChild(legend);
  }
  return container;
}

function renderEmoji() {
  const grid = document.createElement("div");
  grid.className = "option-grid emoji-row";
  [
    { label: "Very poor", value: 1, icon: "😟" },
    { label: "Poor", value: 2, icon: "🙁" },
    { label: "Okay", value: 3, icon: "🙂" },
    { label: "Good", value: 4, icon: "😄" },
    { label: "Excellent", value: 5, icon: "🤩" },
  ].forEach((option) => {
    grid.appendChild(createOption({ ...option, detail: option.label }));
  });
  return grid;
}

function renderScale(question) {
  const container = document.createElement("div");
  container.className = "scale-wrapper";

  const grid = document.createElement("div");
  grid.className = "option-grid rating-row scale-row";
  [1, 2, 3, 4, 5].forEach((value) => {
    const detailText = value === 1 ? question.low : value === 5 ? question.high : `${value} / 5`;
    grid.appendChild(createOption({ label: `${value} (${detailText})`, value, icon: `${value}`, detail: "" }));
  });
  container.appendChild(grid);

  if (question.low || question.high) {
    const legend = document.createElement("div");
    legend.className = "scale-legend";
    legend.innerHTML = `
      <span class="legend-low">1 · ${question.low || ""}</span>
      <span class="legend-high">${question.high || ""} · 5</span>
    `;
    container.appendChild(legend);
  }
  return container;
}

function renderChoice(question) {
  const grid = document.createElement("div");
  grid.className = "option-grid choice-row";
  question.options.forEach((option) => {
    grid.appendChild(createOption({ ...option, detail: option.label }));
  });
  return grid;
}

function renderQuestion() {
  const question = questions[state.index];
  questionCard.classList.remove("is-entering");
  window.requestAnimationFrame(() => {
    questionCard.classList.add("is-entering");
  });
  areaLabel.textContent = `${question.icon} ${question.area}`;
  questionText.textContent = question.question;
  questionNumber.textContent = `${state.index + 1}`;
  answerZone.innerHTML = "";

  const renderers = {
    stars: renderStars,
    emoji: renderEmoji,
    scale: renderScale,
    choice: renderChoice,
  };

  answerZone.appendChild(renderers[question.type](question));
  backButton.disabled = state.index === 0;
  nextButton.disabled = !state.answers[state.index];
  nextButton.textContent = state.index === questions.length - 1 ? "Finish" : "Next";
  updateProgress();
}

function handleDesignationChange() {
  const selected = userDesignationSelect ? userDesignationSelect.value : "Teacher";
  if (otherDesignationGroup) {
    otherDesignationGroup.classList.toggle("is-hidden", selected !== "Other");
    if (selected === "Other" && otherDesignationInput) {
      otherDesignationInput.focus();
    }
  }
}

if (userDesignationSelect) {
  userDesignationSelect.addEventListener("change", () => {
    handleDesignationChange();
    if (formError) formError.textContent = "";
  });
}

function startQuest(event) {
  if (event) event.preventDefault();
  const name = userNameInput ? userNameInput.value.trim() : "";
  const email = userEmailInput ? userEmailInput.value.trim() : "";
  let designation = userDesignationSelect ? userDesignationSelect.value : "Teacher";

  if (!name) {
    if (formError) formError.textContent = "Please enter your full name.";
    if (userNameInput) userNameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (formError) formError.textContent = "Please enter a valid Gmail / Email address.";
    if (userEmailInput) userEmailInput.focus();
    return;
  }

  if (designation === "Other") {
    const customRole = otherDesignationInput ? otherDesignationInput.value.trim() : "";
    if (!customRole) {
      if (formError) formError.textContent = "Please specify your role / designation.";
      if (otherDesignationInput) otherDesignationInput.focus();
      return;
    }
    designation = customRole;
  }

  if (formError) formError.textContent = "";
  state.user = { name, email, designation };
  state.started = true;
  state.index = 0;
  if (visualStage) visualStage.classList.remove("is-complete");
  showOnly(questionCard);
  renderQuestion();
}

if (userNameInput) {
  userNameInput.addEventListener("input", () => {
    if (formError) formError.textContent = "";
  });
}
if (userEmailInput) {
  userEmailInput.addEventListener("input", () => {
    if (formError) formError.textContent = "";
  });
}
if (otherDesignationInput) {
  otherDesignationInput.addEventListener("input", () => {
    if (formError) formError.textContent = "";
  });
}

function goNext() {
  if (!state.answers[state.index]) return;
  if (state.index === questions.length - 1) {
    finishQuest();
    return;
  }
  state.index += 1;
  renderQuestion();
}

function goBack() {
  if (state.index === 0) return;
  state.index -= 1;
  renderQuestion();
}

function finishQuest() {
  state.started = false;
  const answeredCount = state.answers.filter(Boolean).length;
  const average =
    state.answers.reduce((sum, a) => sum + (a?.value || 0), 0) /
    (answeredCount || 1);
  completionTitle.textContent =
    average >= 4.4 ? "Excellent feedback run!" : average >= 3.2 ? "Feedback captured!" : "Improvement signals found";
  const userGreeting = state.user.name
    ? `${state.user.name} (${state.user.designation || "Educator"} · ${state.user.email})`
    : "Educator";
  completionCopy.textContent = `Thank you, ${userGreeting}! You completed all ${questions.length} checkpoints. Your responses are ready to review or save.`;
  summaryGrid.innerHTML = "";

  questions.forEach((question, index) => {
    const item = document.createElement("div");
    item.className = "summary-item";
    item.innerHTML = `<strong>${question.icon} ${question.area}</strong><span>${state.answers[index]?.label || "N/A"}</span>`;
    summaryGrid.appendChild(item);
  });

  showOnly(completeCard);
  if (visualStage) visualStage.classList.add("is-complete");
  updateProgress();
}

function resetAll(force = false) {
  if (!force && state.started && state.answers.some(Boolean)) {
    if (!confirm("Are you sure you want to restart? Your entered answers will be reset.")) {
      return;
    }
  }
  state.started = false;
  state.index = 0;
  state.user = { name: "", email: "", designation: "Teacher" };
  state.answers = Array(questions.length).fill(null);
  if (userNameInput) userNameInput.value = "";
  if (userEmailInput) userEmailInput.value = "";
  if (userDesignationSelect) userDesignationSelect.value = "Teacher";
  if (otherDesignationInput) otherDesignationInput.value = "";
  if (otherDesignationGroup) otherDesignationGroup.classList.add("is-hidden");
  if (visualStage) visualStage.classList.remove("is-complete", "is-answering");
  if (saveStatus) saveStatus.textContent = "";
  if (formError) formError.textContent = "";
  clearSession();
  showOnly(startCard);
  updateProgress();
}

function buildFeedbackPayload() {
  return {
    title: "Amrita Nirman Feedback",
    name: state.user.name || "Anonymous",
    email: state.user.email || "anonymous@gmail.com",
    designation: state.user.designation || "Teacher",
    userName: state.user.name || "Anonymous",
    userEmail: state.user.email || "anonymous@gmail.com",
    userDesignation: state.user.designation || "Teacher",
    completedAt: new Date().toISOString(),
    answers: questions.map((question, index) => ({
      area: question.area,
      question: question.question,
      answer: state.answers[index]?.label || null,
      value: state.answers[index]?.value || null,
    })),
  };
}

const STORAGE_KEY = "amrita_nirman_feedback_state";

function saveSession() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function restoreSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data && data.started && Array.isArray(data.answers)) {
      state.started = data.started;
      state.index = data.index || 0;
      state.user = data.user || { name: "", email: "", designation: "Teacher" };
      state.answers = data.answers;
      if (userNameInput && state.user.name) userNameInput.value = state.user.name;
      if (userEmailInput && state.user.email) userEmailInput.value = state.user.email;
      if (userDesignationSelect && state.user.designation) {
        const standardRoles = ["Teacher", "Student"];
        if (standardRoles.includes(state.user.designation)) {
          userDesignationSelect.value = state.user.designation;
          if (otherDesignationGroup) otherDesignationGroup.classList.add("is-hidden");
        } else {
          userDesignationSelect.value = "Other";
          if (otherDesignationGroup) otherDesignationGroup.classList.remove("is-hidden");
          if (otherDesignationInput) otherDesignationInput.value = state.user.designation;
        }
      }
      showOnly(questionCard);
      renderQuestion();
    }
  } catch (e) {}
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

function downloadResponses() {
  const payload = buildFeedbackPayload();
  const jsonStr = JSON.stringify(payload, null, 2);
  const fileName = `lesson-plan-feedback-${(state.user.name || "user").toLowerCase().replace(/\s+/g, "-")}.json`;

  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([jsonStr], fileName, { type: "application/json" });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({
          title: "Amrita Nirman Feedback",
          text: `Feedback responses from ${state.user.name || "Educator"}`,
          files: [file]
        }).catch((err) => {
          if (err.name !== "AbortError") downloadFallback(jsonStr, fileName);
        });
        return;
      }
    } catch (e) {
      // Fallback
    }
  }
  downloadFallback(jsonStr, fileName);
}

function downloadFallback(jsonStr, fileName) {
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function saveToGoogleDrive() {
  const scriptUrl = window.FEEDBACK_CONFIG?.googleScriptUrl?.trim();

  if (!scriptUrl) {
    saveStatus.textContent =
      "Add your Google Apps Script Web App URL in config.js, then try saving again.";
    return;
  }

  saveDriveButton.disabled = true;
  saveStatus.textContent = `Saving feedback for ${state.user.name || "user"} to Google Drive...`;

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(buildFeedbackPayload()),
    });

    saveStatus.textContent =
      `Feedback from ${state.user.name || "user"} sent! Check your Google Drive spreadsheet for the new row.`;
    clearSession();
  } catch (error) {
    saveStatus.textContent =
      "Could not save to Google Drive. Check the Apps Script URL and deployment permissions.";
  } finally {
    saveDriveButton.disabled = false;
  }
}

// Native Capacitor Mobile Support (Hardware back button, StatusBar, Splash screen)
function initCapacitorBridge() {
  if (typeof window.Capacitor === "undefined") return;

  const plugins = window.Capacitor.Plugins || {};

  // Status Bar styling
  if (plugins.StatusBar) {
    try {
      plugins.StatusBar.setStyle({ style: "DARK" });
      plugins.StatusBar.setBackgroundColor({ color: "#032614" });
    } catch (e) {}
  }

  // Splash Screen hide
  if (plugins.SplashScreen) {
    try {
      setTimeout(() => plugins.SplashScreen.hide(), 400);
    } catch (e) {}
  }

  // Hardware Back Button listener
  if (plugins.App) {
    plugins.App.addListener("backButton", () => {
      if (state.started && state.index > 0) {
        goBack();
      } else if (state.started && state.index === 0) {
        if (confirm("Return to start screen? Unsaved progress will be preserved.")) {
          resetAll();
        }
      } else if (!state.started && completeCard && !completeCard.classList.contains("is-hidden")) {
        resetAll();
      } else {
        plugins.App.exitApp();
      }
    });
  }
}

if (registrationForm) {
  registrationForm.addEventListener("submit", startQuest);
}
if (startButton) {
  startButton.addEventListener("click", startQuest);
}
nextButton.addEventListener("click", () => {
  goNext();
  saveSession();
});
backButton.addEventListener("click", () => {
  goBack();
  saveSession();
});
resetButton.addEventListener("click", () => {
  clearSession();
  resetAll();
});
againButton.addEventListener("click", () => {
  clearSession();
  resetAll();
});
downloadButton.addEventListener("click", downloadResponses);
saveDriveButton.addEventListener("click", saveToGoogleDrive);

document.addEventListener("keydown", (event) => {
  if (!state.started) return;
  const value = Number(event.key);
  const question = questions[state.index];

  if (question.type === "choice" && value >= 1 && value <= question.options.length) {
    answerCurrent(question.options[value - 1]);
    saveSession();
  } else if (question.type !== "choice" && value >= 1 && value <= 5) {
    answerCurrent({ label: `${value}`, value });
    saveSession();
  }

  if (event.key === "Enter" && state.answers[state.index]) {
    goNext();
    saveSession();
  }
});

initDots();
updateProgress();
restoreSession();
initCapacitorBridge();

