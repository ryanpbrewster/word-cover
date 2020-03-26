import React from "react";
import styled from "styled-components";
import { UserMap, TeamMap, Team, User, Label } from "./models";

export const BigButton = styled.button`
  min-height: 48px;
  min-width: 96px;
  border-radius: 16px;
  margin: 24px;
  font-size: 32px;

  &:focus {
    outline: none;
  }
`;

export function labelColor(label: Label): string {
  switch (label) {
    case "red":
      return "rgb(245, 142, 135)";
    case "blue":
      return "rgb(150, 177, 255)";
    case "gray":
      return "rgb(222, 222, 184)";
    case "black":
      return "rgb(89, 90, 94)";
  }
}

interface TeamRosterProps {
  readonly players: UserMap;
  readonly teams: TeamMap;
}
export function TeamRoster({ players, teams }: TeamRosterProps) {
  function byTeam(team: Team): User[] {
    return Object.values(players).filter(player => teams[player.id] === team);
  }
  return (
    <TeamRosterWrapper>
      <PlayerList team="red" players={byTeam("red")} />
      <PlayerList team="blue" players={byTeam("blue")} />
    </TeamRosterWrapper>
  );
}

interface PlayerListProps {
  readonly team: Team;
  readonly players: User[];
}
function PlayerList({ team, players }: PlayerListProps) {
  const content = players.map(player => {
    return (
      <PlayerCard key={player.id} team={team}>
        <PlayerIcon>{player.icon}</PlayerIcon>
        <p>{player.name}</p>
      </PlayerCard>
    );
  });
  return <PlayerListWrapper>{content}</PlayerListWrapper>;
}

const TeamRosterWrapper = styled.div`
  display: flex;
`;

const PlayerListWrapper = styled.div``;

interface PlayerCardProps {
  readonly team: Team;
}
const PlayerCard = styled.div<PlayerCardProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ team }) => labelColor(team)};
  padding: 4px;
  border: solid 1px;
`;

const PlayerIcon = styled.div`
  font-size: 24px;
  width: 24px;
  font-family: monospace;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
`;
