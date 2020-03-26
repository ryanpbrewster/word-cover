import React, { useEffect } from "react";
import { useFirebase } from "./fb";
import { BigButton } from "./Common";
import { mkNonce, splitIntoTeams, mkMask, mkWords } from "./utils";
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
    if (me in game.players) {
      return;
    }
    console.log(`marking ${me}=${myName} as waiting in ${gameId}`);
    app.database().ref(`game/${gameId}`).transaction(cur => {
      console.log(`actual current value = ${JSON.stringify(cur)}`);
      if (cur.nonce !== game.nonce) {
        console.log("nonce differs, bailing");
        return undefined;
      }
      cur.nonce = mkNonce();
      cur.players[me] = myName;
      return cur;
    });
  }, [app, me, gameId, myName, game]);

  function startGame() {
    const words = mkWords();
    const mask = mkMask(words);
    const revealed = Object.fromEntries(words.map((w) => [w, false]));
    const started: PlayingGameState = {
      state: 'playing',
      nonce: mkNonce(),
      players: game.players,
      teams: splitIntoTeams(Object.keys(game.players)),
      words,
      mask,
      revealed,
    };
    console.log(`starting game ${gameId} with ${JSON.stringify(started)}`);
    app.database().ref(`game/${gameId}`).transaction(cur => {
      console.log(`actual current value = ${JSON.stringify(cur)}`);
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
