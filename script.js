import { loginAnon, onAuthReady, saveScore, getTopScores } from "./firebase-config.js";

let uid = null;

loginAnon().catch(err => console.error("Ошибка входа:", err));

onAuthReady((user) => {
  uid = user.uid;
  console.log("Авторизован как:", uid);
  updateLeaderboard();
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
  if (uid) {
    saveScore(uid, "Игрок", score);
    updateLeaderboard();
  }
}, 5000);
