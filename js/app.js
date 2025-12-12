import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAMynBwvGhlGbEi6UCHrZjYHNedf9pqXJQ",
  authDomain: "sunblank-memories.firebaseapp.com",
  projectId: "sunblank-memories",
  storageBucket: "sunblank-memories.appspot.com",
  messagingSenderId: "916551819188",
  appId: "1:916551819188:web:741bfd8c4534b511e35ce1"
};

// 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Util: DOM取得
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
      card.innerHTML = `<p><strong>${data.name}</strong>：${data.text}</p>${dateText ? `<small>${dateText}</small>` : ""}`;
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
    await addDoc(collection(db, "requests"), { name, text, createdAt: serverTimestamp(), status: "考え中…" });
    requestForm.reset();
  });

  const requestsList = $("requests-list");
  const qRequests = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  onSnapshot(qRequests, (snapshot) => {
    requestsList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <p><strong>${data.name}</strong>：${data.text}</p>
        <p>状態：${data.status || "考え中…"}</p>
        <div class="status-buttons">
          <button onclick="updateStatus('${docSnap.id}','叶った！')">叶った！</button>
          <button onclick="updateStatus('${docSnap.id}','準備中！')">準備中！</button>
          <button onclick="updateStatus('${docSnap.id}','考え中…')">考え中…</button>
          <button onclick="updateStatus('${docSnap.id}','また今度！')">また今度！</button>
        </div>
      `;
      requestsList.appendChild(card);
    });
  });
}

window.updateStatus = async (id, status) => {
  const ref = doc(db, "requests", id);
  await updateDoc(ref, { status });
};

// ===== ギャラリー追加リクエスト =====
const galleryRequestForm = $("galleryRequestForm");
if (galleryRequestForm) {
  galleryRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("galleryRequestName").value.trim();
    const text = $("galleryRequestText").value.trim();
    if (!name || !text) return alert("入力してください");
    await addDoc(collection(db, "galleryRequests"), { name, text, createdAt: serverTimestamp() });
    galleryRequestForm.reset();
  });

  const galleryRequestsList = $("galleryRequestsList");
  const qGalleryRequests = query(collection(db, "galleryRequests"), orderBy("createdAt", "desc"));
  onSnapshot(qGalleryRequests, (snapshot) => {
    galleryRequestsList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card