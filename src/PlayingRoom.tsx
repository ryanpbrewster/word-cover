import React, { useState } from "react";
import styled from "styled-components";
import { BigButton, TeamRoster, revealedColor, mutedColor } from "./Common";
import { Label, PlayingGameState, UserId, Word } from "./models";
import { useFirebase } from "./fb";

interface PlayingRoomProps {
  readonly me: UserId;
  readonly game: PlayingGameState;
}
function PlayingRoom({ me, game }: PlayingRoomProps) {
  const [revealAll, setRevealAll] = useState<boolean>(false);
  const cards = game.words.map((word, idx) => {
    return (
      <WordCard
        key={idx}
        me={me}
        game={game}
        word={word}
        forceReveal={revealAll}
      />
    );
  });
  return (
    <GameBoard>
      <TeamRoster players={game.players} teams={game.teams} />
      <BigButton
        onMouseDown={() => setRevealAll(true)}
        onMouseUp={() => setRevealAll(false)}
        onMouseLeave={() => setRevealAll(false)}
      >
        Reveal
      </BigButton>
      <WordBoardWrapper>
        <WordBoard>{cards}</WordBoard>
      </WordBoardWrapper>
    </GameBoard>
  );
}

interface WordCardProps {
  readonly me: UserId;
  readonly game: PlayingGameState;
  readonly word: Word;
  readonly forceReveal: boolean;
}
function WordCard({ me, game, word, forceReveal }: WordCardProps) {
  const app = useFirebase();
  const [countdown, setCountdown] = useState<number | null>(null);
  let label: Label | undefined;
  if (word.revealed || forceReveal) {
    label = word.label;
  }
  function startCountdown() {
    if (me in game.players && !word.revealed && !countdown) {
      setCountdown(setTimeout(() => app.revealWord(game, word.value), 1_000));
    }
  }
  function stopCountdown() {
    if (countdown) {
      clearTimeout(countdown);
    }
    setCountdown(null);
  }
  return (
    <WordCardWrapper
      label={label}
      revealed={word.revealed}
      held={!!countdown && !word.revealed}
      onMouseDown={startCountdown}
      onMouseUp={stopCountdown}
      onMouseLeave={stopCountdown}
    >
      <p>{word.value}</p>
    </WordCardWrapper>
  );
}

const GameBoard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px;
`;

const WordBoardWrapper = styled.div`
  margin: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordBoard = styled.div`
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(5, 1fr);
`;

interface WordCardWrapperProps {
  readonly label?: Label;
  readonly held: boolean;
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

  font-size: 24px;
  color: ${({ label }) => (label === "black" ? "white" : "black")};
  background-color: ${({ held, revealed, label }) =>
    held
      ? "gray"
      : label && (revealed ? revealedColor(label) : mutedColor(label))};

  transition: 1s;

  border: 2px solid rgba(200, 200, 200, 0.6);

  cursor: pointer;
`;

export default PlayingRoom;
