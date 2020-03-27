import firebase from "firebase/app";
import "firebase/database";
import {
  GameState,
  User,
  WaitingGameState,
  PlayingGameState,
  Word
} from "./models";
import { splitIntoTeams, mkWords, mkNonce } from "./utils";

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
      cb(snap.val());
    }
    const ref = this.app.database().ref(`game/${gameId}`);
    ref.on("value", wrapper);
    ref.transaction(cur => {
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
    const players = game.players;
    const teams = splitIntoTeams(Object.keys(players));
    const started: PlayingGameState = {
      id: game.id,
      state: "playing",
      nonce: mkNonce(),
      players,
      teams,
      words
    };
    this.app
      .database()
      .ref(`game/${game.id}`)
      .transaction(cur => {
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
        if (cur.nonce !== game.nonce) {
          return undefined;
        }
        cur.nonce = mkNonce();
        cur.words.find((w: Word) => w.value === word).revealed = true;
        return cur;
      });
  }
}
let cached: FirebaseService | null = null;
export function useFirebase(): FirebaseService {
  if (!cached) {
    const app = firebase.initializeApp(CONFIG);
    cached = new FirebaseService(app);
  }
  return cached;
}
