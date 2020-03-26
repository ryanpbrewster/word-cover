import React from "react";
import styled from "styled-components";
import { TeamRoster, labelColor } from "./Common";
import { Label, PlayingGameState, UserId } from "./models";
import { useFirebase } from "./fb";

interface PlayingRoomProps {
  readonly me: UserId;
  readonly game: PlayingGameState;
}
function PlayingRoom({ me, game }: PlayingRoomProps) {
  const cards = game.words.map((word, idx) => {
    return <WordCard key={idx} me={me} game={game} word={word} />;
  });
  return (
    <GameBoard>
      <TeamRoster players={game.players} teams={game.teams} />
      <WordBoardWrapper>
        <WordBoard>{cards}</WordBoard>
      </WordBoardWrapper>
    </GameBoard>
  );
}

interface WordCardProps {
  readonly me: UserId;
  readonly game: PlayingGameState;
  readonly word: string;
}
function WordCard({ me, game, word }: WordCardProps) {
  const app = useFirebase();
  let label: Label | undefined;
  if (game.revealed[word] || game.teams[me]?.role !== "guesser") {
    label = game.mask[word];
  }
  function onClick() {
    if (me in game.players && !game.revealed[word]) {
      app.revealWord(game, word);
    }
  }
  return (
    <WordCardWrapper
      label={label}
      revealed={game.revealed[word]}
      onClick={onClick}
    >
      <p>{word}</p>
    </WordCardWrapper>
  );
}

const GameBoard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WordBoardWrapper = styled.div`
  margin: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordBoard = styled.div`
  display: grid;
  grid-template: 1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr 1fr 1fr;
`;

interface WordCardWrapperProps {
  readonly label?: Label;
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
  background-color: ${({ label }) => label && labelColor(label)};
  filter: contrast(${({ revealed }) => (revealed ? "150%" : "25%")});

  transition: 1s;

  border: 2px solid rgba(200, 200, 200, 0.6);

  cursor: pointer;
`;

export default PlayingRoom;
