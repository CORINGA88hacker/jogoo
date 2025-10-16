
/*
  firebase.js - lightweight localStorage fallback shim
  This file replaces real Firebase functionality with a localStorage-based implementation
  so the game and chat work offline / without configuring Firebase.
  It implements:
   - firebaseInit(config)
   - firebaseLogin(email, pass)
   - firebaseSignup(email, pass)
   - firebaseUploadProfilePhoto(file) -> returns a dataURL
   - firebaseSaveProfile(profile)
   - firebaseSendChatMessage(msg)
   - firebaseFetchChat()
   - firebaseFetchChatLive() // returns messages (no real-time listener; caller can poll)
   - firebaseDeleteMessage(id)
  Data is stored under localStorage keys:
    jogoo_profiles, jogoo_messages, jogoo_current_user
*/

function _load(key){ try{ return JSON.parse(localStorage.getItem(key)||'null'); }catch(e){ return null; } }
function _save(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

function firebaseInit(config){
  console.warn('firebaseInit(): using LOCALSTORAGE fallback. Replace with real Firebase config for production.');
  // ensure storage structures
  if(!_load('jogoo_profiles')) _save('jogoo_profiles', {});
  if(!_load('jogoo_messages')) _save('jogoo_messages', []);
  return Promise.resolve(true);
}

async function firebaseSignup(email, pass){
  const profiles = _load('jogoo_profiles') || {};
  if(profiles[email]) throw new Error('Usuário já existe');
  profiles[email] = {email:email, password:pass, name: email.split('@')[0], photo:null};
  _save('jogoo_profiles', profiles);
  _save('jogoo_current_user', profiles[email]);
  return profiles[email];
}

async function firebaseLogin(email, pass){
  const profiles = _load('jogoo_profiles') || {};
  const p = profiles[email];
  if(!p || p.password !== pass) throw new Error('Credenciais inválidas');
  _save('jogoo_current_user', p);
  return p;
}

async function firebaseUploadProfilePhoto(file){
  // file can be a File or a dataURL string. We'll accept a File-like object with a .name or a string dataURL.
  if(typeof file === 'string' && file.startsWith('data:')) return file;
  return new Promise((res,rej)=>{
    const reader = new FileReader();
    reader.onload = ()=> res(reader.result);
    reader.onerror = ()=> rej(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

async function firebaseSaveProfile(profile){
  const profiles = _load('jogoo_profiles') || {};
  if(!profile || !profile.email) throw new Error('Perfil inválido');
  profiles[profile.email] = profile;
  _save('jogoo_profiles', profiles);
  _save('jogoo_current_user', profile);
  return profile;
}

function _makeId(){
  return 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}

async function firebaseSendChatMessage(msg){
  // msg: {text, authorEmail, authorName, photo}
  const messages = _load('jogoo_messages') || [];
  const m = Object.assign({}, msg, {id: _makeId(), ts: Date.now()});
  messages.push(m);
  _save('jogoo_messages', messages);
  return m;
}

async function firebaseFetchChat(){
  return (_load('jogoo_messages') || []).slice();
}

async function firebaseFetchChatLive(){
  // alias for fetch (no realtime)
  return firebaseFetchChat();
}

async function firebaseDeleteMessage(id){
  let messages = _load('jogoo_messages') || [];
  messages = messages.filter(m => m.id !== id);
  _save('jogoo_messages', messages);
  return true;
}

// helper to get current user
function firebaseCurrentUser(){
  return _load('jogoo_current_user');
}
