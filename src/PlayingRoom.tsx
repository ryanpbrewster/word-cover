import React from "react";
import styled from "styled-components";
import { Label, PlayingGameState } from './models';

interface PlayingRoomProps {
  readonly gameId: string;
  readonly gameState: PlayingGameState;
  readonly name: string;
}
function PlayingRoom({ gameId, name: myName, gameState: game}: PlayingRoomProps) {
  const board = [];
  for (let i=0; i < 5; i++) {
    const row = [];
    for (let j=0; j < 5; j++) {
      const word = game.words[5 * i + j];
      row.push(<WordCard key={j} label={game.mask[word]}><p>{word}</p></WordCard>);
    }
    board.push(<GameBoardRow key={i}>{row}</GameBoardRow>);
  }
  return <GameBoardWrapper>{board}</GameBoardWrapper>;
}

const GameBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const GameBoardRow = styled.div`
  display: flex;
  flex-direction: row;
`;

interface WordCardProps {
  readonly label: Label;
}
const WordCard = styled.div<WordCardProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 96px;
  height: 72px;
  border: solid 1px;
  border-radius: 16px;

  background-color: ${({label}) => labelColor(label)};
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
