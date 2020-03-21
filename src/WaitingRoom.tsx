import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { useFirebase } from "./fb";
import { Redirect, useParams } from "react-router-dom";
import { BigButton } from "./Common";
import styled from "styled-components";

function SanitizedWaitingRoom() {
  const { gameId } = useParams();
  const name = localStorage.getItem("name");

  if (!gameId || !name) {
    return <Redirect to="/" />;
  }
  return <WaitingRoom gameId={gameId} name={name} />;
}

interface WaitingRoomProps {
  readonly gameId: string;
  readonly name: string;
}
function WaitingRoom({ gameId, name: myName }: WaitingRoomProps) {
  const { app, me } = useFirebase();
  const [waiting, setWaiting] = useState<UserMap>({});

  useEffect(() => {
    console.log(`marking ${me}=${myName} as waiting in wait/${gameId}`);
    app
      .database()
      .ref(`wait/${gameId}/${me}`)
      .set(myName);
  }, [app, me, gameId, myName]);

  useEffect(() => {
    function cb(snap: firebase.database.DataSnapshot) {
      const key = snap.key!;
      const value = snap.val();
      console.log("recv: ", key, value);
      if (typeof value === "string") {
        setWaiting(acc => ({ ...acc, [key]: value }));
      }
    }
    console.log(`listening to wait/${gameId}`);
    const ref = app.database().ref(`wait/${gameId}`);
    ref.on("child_added", cb);
    return () => {
      console.log(`unlisten from wait/${gameId}`);
      ref.off("child_added", cb);
    };
  }, [app, gameId, myName]);

  const playerContent = Object.entries(waiting).map(([id, name]) => {
    return <PlayerCard key={id}>{name}</PlayerCard>;
  });
  return (
    <WaitingPlayers>
      <BigButton>Start</BigButton>
      {playerContent}
    </WaitingPlayers>
  );
}

type UserMap = { [key: string]: string };

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

export default SanitizedWaitingRoom;
