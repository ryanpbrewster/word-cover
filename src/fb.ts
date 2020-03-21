import firebase from 'firebase/app';
import 'firebase/auth';
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


let app: firebase.app.App | null = null;
export function useFirebase(): firebase.app.App {
  if (!app) {
    console.log("[INIT] initializing application...");
    app = firebase.initializeApp(CONFIG);
    app.auth().signInAnonymously()
      .then(() => console.log("logged in!"))
      .catch(err => {
        console.error("[AUTH] error: ", err);
      });
  }
  return app;
}
