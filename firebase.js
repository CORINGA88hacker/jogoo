
// Arquivo de integração com Firebase - exemplo mínimo
// Substitua os valores de firebaseConfig com os da sua console Firebase e adicione o SDK no HTML se hospedar.
const firebaseConfig = {
  apiKey: "COLOQUE_AQUI",
  authDomain: "COLOQUE_AQUI",
  databaseURL: "COLOQUE_AQUI",
  projectId: "COLOQUE_AQUI",
  storageBucket: "COLOQUE_AQUI",
  messagingSenderId: "COLOQUE_AQUI",
  appId: "COLOQUE_AQUI"
};

// STUBS / exemplos - implemente com firebase SDK.
async function firebaseLogin(email, pass){ throw new Error('Implementar firebaseLogin com firebase.auth()'); }
async function firebaseSignup(email, pass){ throw new Error('Implementar firebaseSignup com firebase.auth()'); }
async function firebaseUploadProfilePhoto(file){ throw new Error('Implementar upload com firebase.storage()'); }
async function firebaseSaveProfile(profile){ throw new Error('Implementar salvar perfil no database'); }
async function firebaseSendChatMessage(msg){ throw new Error('Implementar envio de mensagem no database'); }
async function firebaseFetchChat(){ throw new Error('Implementar leitura do chat'); }
async function firebaseFetchChatLive(){ return []; /* implementar escuta em tempo real */ }
async function firebaseDeleteMessage(id){ throw new Error('Implementar deleção de mensagem'); }
