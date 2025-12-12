import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMynBwvGhlGbEi6UCHrZjYHNedf9pqXJQ",
  authDomain: "sunblank-memories.firebaseapp.com",
  projectId: "sunblank-memories",
  storageBucket: "sunblank-memories.appspot.com",
  messagingSenderId: "916551819188",
  appId: "1:916551819188:web:741bfd8c4534b511e35ce1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

// ===== 思い出コメント =====
const memoriesForm = $("memoriesForm");
if (memoriesForm) {
  memoriesForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("memoriesName").value.trim();
    const text = $("memoriesText").value.trim();
    if (!name || !text) return alert("入力してください");
    await addDoc(collection(db, "memories"), { name, text, createdAt: serverTimestamp() });
    memoriesForm.reset();
  });

  const memoriesList = $("memories-list");
  const qMemories = query(collection(db, "memories"), orderBy("createdAt", "desc"));
  onSnapshot(qMemories, (snapshot) => {
    memoriesList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.className = "card";
      const dateText = data.createdAt ? data.createdAt.toDate().toLocaleString("ja-JP") : "";
      card.innerHTML = `
        <p><strong>${data.name}</strong>：${data.text}</p>
        ${dateText ? `<small>${dateText}</small>` : ""}
        <div class="card-actions">
          <button class="btn btn-danger" onclick="deletePost('memories','${docSnap.id}')">削除</button>
        </div>
      `;
      memoriesList.appendChild(card);
    });
  });
}

// ===== リクエスト =====
const requestForm = $("requestForm");
if (requestForm) {
  requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("requestName").value.trim();
    const text = $("requestText").value.trim();
    if (!name || !text) return alert("入力してください");
    await addDoc(collection(db, "requests"), { name, text, createdAt: serverTimestamp(), status: "検討中" });
    requestForm.reset();
  });

  const requestsList = $("requests-list");
  const qRequests = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  onSnapshot(qRequests, (snapshot) => {
    requestsList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // 状態ラベル色分け
      let statusClass = "status-think";
      if (data.status === "叶った！") statusClass = "status-happy
