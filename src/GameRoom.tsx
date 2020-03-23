import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { GameState } from "./models";
import { useFirebase } from "./fb";
import WaitingRoom from "./WaitingRoom";
import PlayingRoom from "./PlayingRoom";

function SanitizedGameRoom() {
  const { gameId } = useParams();
  const name = localStorage.getItem("name");

  if (!gameId || !name) {
    return <Redirect to="/" />;
  }
  return <GameRoom gameId={gameId} name={name} />;
}

interface GameRoomProps {
  readonly gameId: string;
  readonly name: string;
}
function GameRoom({ gameId, name: myName }: GameRoomProps) {
  const { app } = useFirebase();
  const [gameState, setGameState] = useState<GameState | null>(null);
  useEffect(() => {
    function cb(snap: firebase.database.DataSnapshot): void {
      setGameState(snap.val());
    }
    const ref = app.database().ref(`game/${gameId}`);
    ref.on("value", cb);
    return () => ref.off("value", cb);
  }, [app, gameId]);

  if (!gameState) {
    return <p>Loading...</p>;
  } 
  switch (gameState.state) {
    case "waiting": 
      return <WaitingRoom gameId={gameId} gameState={gameState} name={myName}/>;
    case "playing":
      return <PlayingRoom gameId={gameId} gameState={gameState} name={myName}/>;
    default:
      throw Error(`unknown game state: ${JSON.stringify(gameState)}`);
  }
}

export default SanitizedGameRoom;
