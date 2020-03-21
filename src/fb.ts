import firebase from 'firebase/app';
import 'firebase/database';

const CONFIG = {
  apiKey: "AIzaSyBxBnQGMQ8IkCmZn78uOlGWW3Si3Q9li9Q",
  authDomain: "word-cover.firebaseapp.com",
  databaseURL: "https://word-cover.firebaseio.com",
  projectId: "word-cover",
  storageBucket: "word-cover.appspot.com",
  messagingSenderId: "464219508429",
  appId: "1:464219508429:web:b1cd9406fc83998d372384",
  measurementId: "G-RLV6JQN1BE"
};

export interface FirebaseService {
  readonly me: string; // the user id of this user
  readonly app: firebase.app.App;
}
let cached: FirebaseService | null = null;
export function useFirebase(): FirebaseService {
  if (!cached) {
    console.log("[INIT] initializing application...");
    const app = firebase.initializeApp(CONFIG);
    let me = localStorage.getItem("me");
    if (!me) {
      me = Math.random().toString(36).substring(2);
      localStorage.setItem("me", me);
    }
    cached = { app, me };
    console.log(`[INIT] done initializing service:`, cached);
  }
  return cached;
}
