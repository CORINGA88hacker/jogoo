function initFirebase() {
  if (!window.firebase) return console.warn('Firebase não carregado');
  
  const firebaseConfig = {
    apiKey: "AIzaSyBHIc2E4XwRO5FXo4uHlTQVRArOis73MjE",
    authDomain: "projeto-deus-yato-928-sk-default-rtdb.firebaseapp.com",
    databaseURL: "https://projeto-deus-yato-928-sk-default-rtdb.firebaseio.com",
    projectId: "projeto-deus-yato-928-sk-default-rtdb",
    storageBucket: "projeto-deus-yato-928-sk-default-rtdb.appspot.com",
    messagingSenderId: "790408726854",
    appId: "1:790408726854:android:e2f0de7b7d5dba96b0fd47"
  };

  firebase.initializeApp(firebaseConfig);

  // optional: enable offline persistence
  if (firebase.database && firebase.database().enablePersistence) {
    firebase.database().enablePersistence().catch((err) => {
      console.warn('Persistence failed', err);
    });
  }
}
