import firebase from "firebase/app";
import "firebase/database";
import { GameState, User, WaitingGameState, PlayingGameState } from "./models";
import { splitIntoTeams, mkMask, mkWords, mkNonce } from "./utils";

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

type Unsubscribe = () => void;
export class FirebaseService {
  constructor(private readonly app: firebase.app.App) {}

  watchGame(
    gameId: string,
    me: User,
    cb: (game: GameState) => void
  ): Unsubscribe {
    function wrapper(snap: firebase.database.DataSnapshot): void {
      console.log("GAME STATE:", snap.val());
      cb(snap.val());
    }
    const ref = this.app.database().ref(`game/${gameId}`);
    ref.on("value", wrapper);
    ref.transaction(cur => {
      console.log(`[RPB] initializing game, cur = ${JSON.stringify(cur)}`);
      if (!cur) {
        const waiting: WaitingGameState = {
          id: gameId,
          state: "waiting",
          nonce: mkNonce(),
          players: { [me.id]: me }
        };
        cur = waiting;
      }
      if (cur.state !== "waiting") {
        return;
      }
      cur.players[me.id] = me;
      return cur;
    });
    return () => ref.off("value", wrapper);
  }

  startGame(game: WaitingGameState): void {
    const words = mkWords();
    const mask = mkMask(words);
    const revealed = Object.fromEntries(words.map(w => [w, false]));
    const players = game.players;
    const teams = splitIntoTeams(Object.keys(players));
    const started: PlayingGameState = {
      id: game.id,
      state: "playing",
      nonce: mkNonce(),
      players,
      teams,
      words,
      mask,
      revealed
    };
    console.log(`starting game ${game.id} with ${JSON.stringify(started)}`);
    this.app
      .database()
      .ref(`game/${game.id}`)
      .transaction(cur => {
        console.log(`actual current value = ${JSON.stringify(cur)}`);
        if (cur.nonce !== game.nonce) {
          return undefined;
        }
        return started;
      });
  }

  revealWord(game: PlayingGameState, word: string): void {
    this.app
      .database()
      .ref(`game/${game.id}`)
      .transaction(cur => {
        console.log(`actual current value = ${JSON.stringify(cur)}`);
        if (cur.nonce !== game.nonce) {
          return undefined;
        }
        cur.nonce = mkNonce();
        cur.revealed[word] = true;
        return cur;
      });
  }
}
let cached: FirebaseService | null = null;
export function useFirebase(): FirebaseService {
  if (!cached) {
    console.log("[INIT] initializing application...");
    const app = firebase.initializeApp(CONFIG);
    cached = new FirebaseService(app);
    console.log(`[INIT] done initializing service:`, cached);
  }
  return cached;
}
