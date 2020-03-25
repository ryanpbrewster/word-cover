import React from "react";
import styled from "styled-components";
import { Label, PlayingGameState } from './models';

interface PlayingRoomProps {
  readonly gameId: string;
  readonly gameState: PlayingGameState;
  readonly name: string;
}
function PlayingRoom({ gameId, name: myName, gameState: game}: PlayingRoomProps) {
  const cards = game.words.map((word, idx) => {
    return <WordCard key={idx} label={game.mask[word]}><p>{word}</p></WordCard>;
  });
  return <GameBoard>
    <WordBoardWrapper><WordBoard>{cards}</WordBoard></WordBoardWrapper>
  </GameBoard>;
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

interface WordCardProps {
  readonly label: Label;
}
const WordCard = styled.div<WordCardProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  border: solid 1px;
  border-radius: 16px;

  min-width: 48px;
  margin: 4px;
  padding: 4px;

  background-color: ${({label}) => labelColor(label)};
`;
function labelColor(label: Label): string {
  switch (label) {
    case 'one': return 'rgb(245, 142, 135, 0.4)';
    case 'two': return 'rgb(150, 177, 255, 0.4)';
    case 'neutral': return 'rgb(222, 222, 184, 0.4)';
    case 'death': return 'rgb(89, 90, 94, 0.4)';
  }
}

export default PlayingRoom;
