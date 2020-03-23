import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { useFirebase } from "./fb";
import { Redirect, useParams } from "react-router-dom";
import { BigButton } from "./Common";
import { mkNonce, splitIntoTeams, mkWords } from "./utils";
import styled from "styled-components";
import { PlayingGameState, WaitingGameState } from './models';

interface WaitingRoomProps {
  readonly gameId: string;
  readonly gameState: WaitingGameState;
  readonly name: string;
}
function WaitingRoom({ gameId, name: myName, gameState: game}: WaitingRoomProps) {
  const { app, me } = useFirebase();

  useEffect(() => {
    console.log(`marking ${me}=${myName} as waiting in ${gameId}`);
    app.database().ref(`game/${gameId}`).transaction(cur => {
      console.log(`current value = ${JSON.stringify(cur)}`);
      if (cur.nonce !== game.nonce) {
        return undefined;
      }
      cur.nonce = mkNonce();
      cur.players[me] = myName;
      return cur;
    });
  }, [app, me, gameId, myName]);

  function startGame() {
    console.log(`starting game ${gameId} with ${Object.entries(game.players)}`);
    const started: PlayingGameState = {
      state: 'playing',
      nonce: mkNonce(),
      players: game.players,
      teams: splitIntoTeams(Object.keys(game.players)),
      words: mkWords(),
    };
    app.database().ref(`game/${gameId}`).transaction(cur => {
      console.log(`current value = ${JSON.stringify(cur)}`);
      if (cur.nonce !== game.nonce) {
        return undefined;
      }
      return started;
    });
  }

  const playerContent = Object.entries(game.players).map(([id, name]) => {
    return <PlayerCard key={id}>{name}</PlayerCard>;
  });
  const disabled = Object.keys(game.players).length < 2;
  return (
    <WaitingPlayers>
      <BigButton onClick={startGame} disabled={disabled}>Start</BigButton>
      {playerContent}
    </WaitingPlayers>
  );
}

const WaitingPlayers = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PlayerCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 24px;
  width: 96px;
  border-radius: 12px;
`;

export default WaitingRoom;
