export type GameState = WaitingGameState | PlayingGameState | OverGameState;

export interface WaitingGameState {
  readonly state: 'waiting';
  readonly nonce: string;
  readonly players: UserMap;
}

export interface OverGameState {
  readonly state: 'over';
}

export interface PlayingGameState {
  readonly state: 'playing';
  readonly nonce: string;
  readonly players: UserMap;
  readonly teams: Team[];
  readonly words: string[];
  readonly mask: LabelMap;
  readonly public: LabelMap;
}

export type Label = 'one' | 'two' | 'neutral' | 'death';
export type LabelMap = { [word: string]: Label };

export type UserId = string;
export type UserMap = { [id: string]: string };
export type Team = UserId[];
