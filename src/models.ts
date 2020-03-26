export type GameState = WaitingGameState | PlayingGameState | OverGameState;

export type GameId = string;
export interface WaitingGameState {
  readonly id: GameId;
  readonly state: "waiting";
  readonly nonce: string;
  readonly players: UserMap;
}

export interface OverGameState {
  readonly id: GameId;
  readonly state: "over";
}

export interface PlayingGameState {
  readonly id: GameId;
  readonly state: "playing";
  readonly nonce: string;
  readonly players: UserMap;
  readonly teams: TeamMap;
  readonly words: string[];
  readonly mask: LabelMap;
  readonly revealed: WordSet;
}

export type Label = TeamId | "gray" | "black";
export type LabelMap = { [word: string]: Label };
export type WordSet = { [word: string]: boolean };

export type UserId = string;
export interface User {
  readonly id: UserId;
  readonly name: string;
  readonly icon: string;
}
export type UserMap = { [id: string]: User };

export type TeamId = "red" | "blue";
export type Role = "leader" | "guesser";
export interface TeamRole {
  readonly team: TeamId;
  readonly role: Role;
}

export type TeamMap = { [id: string]: TeamRole };
