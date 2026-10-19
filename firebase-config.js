// Используем CDN-версию SDK — работает без сборщиков, прямо в браузере
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getFirestore, doc, setDoc, getDoc, 
  collection, query, orderBy, limit, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBd5v7EObJ9IZjD96HSnEnJJ_-A9t53s0Q",
  authDomain: "chess-online-friend.firebaseapp.com",
  projectId: "chess-online-friend",
  storageBucket: "chess-online-friend.firebasestorage.app",
  messagingSenderId: "423448689920",
  appId: "1:423448689920:web:50a2fb9df81ca39faac7e5",
  measurementId: "G-TYTNM5B08S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

export function loginAnon() {
  return signInAnonymously(auth);
}

export function onAuthReady(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) callback(user);
  });
}

export async function saveScore(uid, name, score) {
  try {
    await setDoc(doc(db, "leaderboard", uid), { 
      name, 
      score, 
      updatedAt: Date.now() 
    });
  } catch (e) {
    console.error("Ошибка сохранения:", e);
  }
}

export async function getTopScores() {
  const q = query(
    collection(db, "leaderboard"), 
    orderBy("score", "desc"), 
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
