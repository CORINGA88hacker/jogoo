// Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBHIc2E4XwRO5FXo4uHlTQVRArOis73MjE",
  authDomain: "projeto-deus-yato-928-sk-default-rtdb.firebaseapp.com",
  databaseURL: "https://projeto-deus-yato-928-sk-default-rtdb.firebaseio.com",
  projectId: "projeto-deus-yato-928-sk-default-rtdb",
  storageBucket: "projeto-deus-yato-928-sk-default-rtdb.appspot.com",
  messagingSenderId: "790408726854",
  appId: "1:790408726854:android:e2f0de7b7d5dba96b0fd47"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Enviar mensagem
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (text === "") return;

  const user = firebase.auth().currentUser;
  const name = user && user.displayName ? user.displayName : "Jogador";

  db.ref("chat").push({
    name: name,
    text: text,
    timestamp: Date.now()
  });

  input.value = "";
}

// Escutar mensagens em tempo real
function listenMessages() {
  const chatBox = document.getElementById("chatBox");
  db.ref("chat").orderByChild("timestamp").on("child_added", (snapshot) => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.classList.add("msg");
    div.innerHTML = `<b>${msg.name}:</b> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Iniciar listener após login
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    listenMessages();
  }
});
