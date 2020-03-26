import React from "react";
import styled from "styled-components";
import { Label, PlayingGameState } from './models';
import { useFirebase } from './fb';
import { mkNonce } from './utils';

interface PlayingRoomProps {
  readonly gameId: string;
  readonly gameState: PlayingGameState;
  readonly name: string;
}
function PlayingRoom({ gameId, name: myName, gameState: game}: PlayingRoomProps) {
  const cards = game.words.map((word, idx) => {
    return <WordCard
            key={idx}
            gameId={gameId}
            gameState={game}
            word={word}
            label={game.mask[word]}
            revealed={game.revealed[word]}/>;
  });
  return <GameBoard>
    <WordBoardWrapper><WordBoard>{cards}</WordBoard></WordBoardWrapper>
  </GameBoard>;
}

interface WordCardProps {
  readonly gameId: string;
  readonly gameState: PlayingGameState;
  readonly word: string;
  readonly label: Label;
  readonly revealed: boolean;
}
function WordCard({ gameId, gameState: game, word, label, revealed }: WordCardProps) {
  const { app } = useFirebase();
  function onClick() {
    app.database().ref(`game/${gameId}`).transaction(cur => {
      if (cur.nonce !== game.nonce) {
        return undefined;
      }
      cur.nonce = mkNonce();
      cur.revealed[word] = true;
      return cur;
    });
  }
  return <WordCardWrapper
          label={label}
          revealed={revealed}
          onClick={onClick}>
    <p>{word}</p>
  </WordCardWrapper>;
}

const GameBoard = styled.div`
  height: 100%;
  display: grid;
  grid-template: 1fr 3fr 1fr / 1fr 3fr 1fr;
`;

const WordBoardWrapper = styled.div`
  grid-area: 2/2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordBoard = styled.div`
  display: grid;
  grid-template: 1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr 1fr 1fr;
`;

interface WordCardWrapperProps {
  readonly label: Label;
  readonly revealed: boolean;
}
const WordCardWrapper = styled.div<WordCardWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  border-radius: 16px;

  min-width: 48px;
  margin: 4px;
  padding: 4px;

  background-color: ${({label}) => labelColor(label)};
  filter: contrast(${({revealed}) => revealed ? "150%" : "50%"});
  transition: 1s;

  border: 2px solid rgba(200, 200, 200, 0.6);

  cursor: pointer;
`;
function labelColor(label: Label): string {
  switch (label) {
    case 'one': return 'rgb(245, 142, 135)';
    case 'two': return 'rgb(150, 177, 255)';
    case 'neutral': return 'rgb(222, 222, 184)';
    case 'death': return 'rgb(89, 90, 94)';
  }
}

export default PlayingRoom;
