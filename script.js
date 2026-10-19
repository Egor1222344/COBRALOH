import { loginAnon, saveScore, getTopScores, auth } from "./firebase-config.js";

let score = parseInt(localStorage.getItem("score")) || 0;
let perClick = parseInt(localStorage.getItem("perClick")) || 1;
let perSecond = parseInt(localStorage.getItem("perSecond")) || 0;

const scoreEl = document.getElementById("score");
const cobra = document.getElementById("cobra");
const statusEl = document.getElementById("status");

function updateUI() {
  scoreEl.textContent = `Унижений: ${score}`;
}

cobra.addEventListener("click", () => {
  score += perClick;
  statusEl.textContent = "Кобра унижена 😢";
  cobra.src = "assets/cobra-crying.png";
  setTimeout(() => cobra.src = "assets/cobra-normal.png", 300);
  updateUI();
  localStorage.setItem("score", score);
});

// Автокликер
setInterval(() => {
  if (perSecond > 0) {
    score += perSecond;
    updateUI();
    localStorage.setItem("score", score);
  }
}, 1000);

// Улучшения
document.getElementById("upgrade1").addEventListener("click", () => {
  if (score >= 10) {
    score -= 10;
    perClick += 1;
    localStorage.setItem("perClick", perClick);
    localStorage.setItem("score", score);
    updateUI();
  }
});

document.getElementById("upgrade2").addEventListener("click", () => {
  if (score >= 50) {
    score -= 50;
    perSecond += 1;
    localStorage.setItem("perSecond", perSecond);
    localStorage.setItem("score", score);
    updateUI();
  }
});

// Скины
document.querySelectorAll("#skins button").forEach(btn => {
  btn.addEventListener("click", () => {
    const skin = btn.dataset.skin;
    cobra.dataset.skin = skin;
    localStorage.setItem("skin", skin);
  });
});

// Firebase
let uid = null;
loginAnon().then(() => {
  uid = auth.currentUser.uid;
});

async function updateLeaderboard() {
  const top = await getTopScores();
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  top.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    list.appendChild(li);
  });
}

setInterval(() => {
  if (uid) saveScore(uid, "Игрок", score);
  updateLeaderboard();
}, 5000);

updateUI();
