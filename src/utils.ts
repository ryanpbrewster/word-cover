import { Label, LabelMap, TeamMap, UserId } from "./models";

export function mkNonce(): string {
  return Math.random()
    .toString(36)
    .substring(2);
}

function shuffle<T>(xs: T[]): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = xs[i];
    xs[i] = xs[j];
    xs[j] = tmp;
  }
}

export function splitIntoTeams(users: UserId[]): TeamMap {
  return Object.fromEntries(
    users.map((userId, idx) => {
      const team = idx % 2 === 0 ? "red" : "blue";
      const role = idx < 2 ? "leader" : "guesser";
      return [userId, { team, role }];
    })
  );
}

export function mkMask(words: string[]): LabelMap {
  const labels: Label[] = [];
  for (let i = 0; i < 9; i++) {
    labels.push("red");
  }
  for (let i = 0; i < 8; i++) {
    labels.push("blue");
  }
  for (let i = 0; i < 7; i++) {
    labels.push("gray");
  }
  for (let i = 0; i < 1; i++) {
    labels.push("black");
  }
  shuffle(labels);
  return Object.fromEntries(words.map((word, i) => [word, labels[i]]));
}

export function mkWords(): string[] {
  const chosen = new Set<string>();
  while (chosen.size < 25) {
    const idx = Math.floor(Math.random() * WORDS.length);
    chosen.add(WORDS[idx]);
  }
  return Array.from(chosen);
}

const WORDS = [
  "africa",
  "agent",
  "air",
  "alien",
  "amazon",
  "angel",
  "antarctica",
  "apple",
  "arm",
  "back",
  "band",
  "bank",
  "bark",
  "beach",
  "belt",
  "berlin",
  "berry",
  "board",
  "bond",
  "boom",
  "bow",
  "box",
  "bug",
  "canada",
  "capital",
  "cell",
  "center",
  "china",
  "chocolate",
  "circle",
  "club",
  "compound",
  "copper",
  "crash",
  "cricket",
  "cross",
  "death",
  "dice",
  "dinosaur",
  "doctor",
  "dog",
  "dress",
  "dwarf",
  "eagle",
  "egypt",
  "engine",
  "england",
  "europe",
  "eye",
  "fair",
  "fall",
  "fan",
  "field",
  "file",
  "film",
  "fish",
  "flute",
  "fly",
  "forest",
  "fork",
  "france",
  "gas",
  "ghost",
  "giant",
  "glass",
  "glove",
  "gold",
  "grass",
  "greece",
  "green",
  "ham",
  "head",
  "himalaya",
  "hole",
  "hood",
  "hook",
  "human",
  "horseshoe",
  "hospital",
  "hotel",
  "ice",
  "ice cream",
  "india",
  "iron",
  "ivory",
  "jam",
  "jet",
  "jupiter",
  "kangaroo",
  "ketchup",
  "kid",
  "king",
  "kiwi",
  "knife",
  "knight",
  "lab",
  "lap",
  "laser",
  "lawyer",
  "lead",
  "lemon",
  "limousine",
  "leadlock",
  "log",
  "mammoth",
  "maple",
  "march",
  "mass",
  "mercury",
  "millionaire",
  "model",
  "mole",
  "moscow",
  "mouth",
  "mug",
  "needle",
  "net",
  "new york",
  "night",
  "note",
  "novel",
  "nurse",
  "nut",
  "oil",
  "olive",
  "olympus",
  "opera",
  "orange",
  "paper",
  "park",
  "part",
  "paste",
  "phoenix",
  "piano",
  "telescope",
  "teacher",
  "switch",
  "swing",
  "sub",
  "stick",
  "staff",
  "stadium",
  "sprint",
  "spike",
  "snowman",
  "slip",
  "shot",
  "shadow",
  "server",
  "ruler",
  "row",
  "rose",
  "root",
  "rome",
  "rock",
  "robot",
  "robin",
  "revolution",
  "rat",
  "racket",
  "queen",
  "press",
  "port",
  "pilot",
  "time",
  "tooth",
  "tower",
  "truck",
  "triangle",
  "trip",
  "turkey",
  "undertaker",
  "unicorn",
  "vacuum",
  "van",
  "wake",
  "wall",
  "war",
  "washer",
  "washington",
  "water",
  "wave",
  "well",
  "whale",
  "whip",
  "worm",
  "yard",
];
