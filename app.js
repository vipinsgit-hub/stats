// ---------- CONSTANTS ----------
const MAX_STAT = 100;

// ---------- GAME STATE ----------
const state = {
  level: 5,
  xp: 40,
  xpToNext: 100,
  stats: {
    STR: 12,
    INT: 10,
    CHA: 7,
    HLT: 9,
    WLT: 6,
    DIS: 4
  }
};

// ---------- DOM ELEMENTS ----------
const levelValueEl = document.getElementById("level-value");
const xpTextEl = document.getElementById("xp-text");
const xpBarFillEl = document.getElementById("xp-bar-fill");

const statBars = {};
const statValues = {};
["STR", "INT", "CHA", "HLT", "WLT", "DIS"].forEach(code => {
  statBars[code] = document.querySelector(`[data-stat-bar="${code}"]`);
  statValues[code] = document.querySelector(`[data-stat-value="${code}"]`);
});

const navButtons = document.querySelectorAll(".nav-btn");
const statsScreen = document.getElementById("stats-screen");
const missionsScreen = document.getElementById("missions-screen");
const backLink = document.getElementById("back-link");
const missionCards = document.querySelectorAll(".mission-card");

// ---------- UPDATE FUNCTIONS ----------
function updateXPUI() {
  levelValueEl.textContent = state.level;
  xpTextEl.textContent = `${state.xp} / ${state.xpToNext}`;

  const ratio = Math.max(0, Math.min(1, state.xp / state.xpToNext));
  xpBarFillEl.style.width = `${ratio * 100}%`;
}

function updateStatsUI() {
  Object.keys(state.stats).forEach(code => {
    const rawValue = state.stats[code];
    const clamped = Math.min(MAX_STAT, Math.max(0, rawValue));

    // show real value, but you can use clamped if you truly never want >100 displayed
    statValues[code].textContent = clamped;

    const percent = Math.max(5, Math.min(100, (clamped / MAX_STAT) * 100));
    const bar = statBars[code];
    bar.style.width = `${percent}%`;
    bar.style.background =
      code === "STR" ? "var(--str)" :
      code === "INT" ? "var(--int)" :
      code === "CHA" ? "var(--cha)" :
      code === "HLT" ? "var(--hlt)" :
      code === "WLT" ? "var(--wlt)" :
      "var(--dis)";
  });
}

function addXP(amount) {
  state.xp += amount;
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = 100 * state.level; // simple formula
  }
  updateXPUI();
}

function completeMission(xpGain, statCode) {
  addXP(xpGain);
  if (state.stats[statCode] != null) {
    state.stats[statCode] = Math.min(
      MAX_STAT,
      state.stats[statCode] + 1
    ); // cap at 100
    updateStatsUI();
  }
}

// ---------- NAVIGATION ----------
function showScreen(name) {
  if (name === "stats") {
    statsScreen.classList.add("active");
    missionsScreen.classList.remove("active");
  } else if (name === "missions") {
    missionsScreen.classList.add("active");
    statsScreen.classList.remove("active");
  }
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const screen = btn.dataset.screen;
    if (!screen || btn.disabled) return;
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    showScreen(screen);
  });
});

backLink.addEventListener("click", () => {
  showScreen("stats");
  navButtons.forEach(b => b.classList.remove("active"));
  document.querySelector('[data-screen="stats"]').classList.add("active");
});

// ---------- MISSION CLICK HANDLERS ----------
missionCards.forEach(card => {
  card.addEventListener("click", () => {
    const xp = Number(card.dataset.xp || "0");
    const stat = card.dataset.stat;
    completeMission(xp, stat);
  });
});

// ---------- INITIAL RENDER ----------
updateXPUI();
updateStatsUI();
