import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBoThv3XSK8PSaIAuIP05gTeizMuyjQKUg",
    authDomain: "muro-interactivo-3e3ff.firebaseapp.com",
    projectId: "muro-interactivo-3e3ff",
    storageBucket: "muro-interactivo-3e3ff.firebasestorage.app",
    messagingSenderId: "629984285226",
    appId: "1:629984285226:web:9e269149b642d49e8c6953"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth(app);