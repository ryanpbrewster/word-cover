import React from 'react';
import { useParams } from 'react-router-dom';

function WaitingRoom() {
  const { gameId } = useParams();
  return <p>Waiting on {gameId}</p>;
}

export default WaitingRoom;
