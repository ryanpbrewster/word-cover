import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { useFirebase } from "./fb";
import { Redirect, useParams } from "react-router-dom";
import { BigButton } from "./Common";
import { mkNonce, splitIntoTeams, mkWords } from "./utils";
import styled from "styled-components";
import { PlayingGameState, WaitingGameState } from './models';

interface PlayingRoomProps {
  readonly gameId: string;
  readonly gameState: PlayingGameState;
  readonly name: string;
}
function PlayingRoom({ gameId, name: myName, gameState: game}: PlayingRoomProps) {
  const { app, me } = useFirebase();

  const board = [];
  for (let i=0; i < 5; i++) {
    const row = [];
    for (let j=0; j < 5; j++) {
      row.push(<WordCard><p>{game.words[5 * i + j]}</p></WordCard>);
    }
    board.push(<GameBoardRow>{row}</GameBoardRow>);
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
const WordCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 96px;
  height: 48px;
  border: solid 1px;
  border-radius: 16px;
`;

export default PlayingRoom;
