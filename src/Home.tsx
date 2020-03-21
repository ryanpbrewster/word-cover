import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

function Home() {
  const history = useHistory();
  const roomRef = React.createRef<HTMLInputElement>();
  const nameRef = React.createRef<HTMLInputElement>();
  function onClick() {
    const room = roomRef.current?.value;
    const name = nameRef.current?.value;
    if (name && room) {
      console.log(`${name} joining ${room}`);
      history.push(`/wait/${room}`);
    }
  }
  return <HomeWrapper>
    <h3>Room Code</h3>
    <BigInput type="text" ref={roomRef} placeholder="Enter Room Code" maxLength={4} style={{ textTransform: "uppercase" }}/>

    <h3>Name</h3>
    <BigInput type="text" ref={nameRef} placeholder="Enter Name" maxLength={12}/>

    <BigButton onClick={onClick}>Play</BigButton>
  </HomeWrapper>;
}

const HomeWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BigInput = styled.input`
  height: 24px;
  border-radius: 16px;
  padding: 2px 8px;

  &:focus {
    outline: none;
  }
`;

const BigButton = styled.button`
  height: 48px;
  width: 96px;
  border-radius: 16px;
  margin: 24px;
  font-size: 32px;

  &:focus {
    outline: none;
  }
`;

export default Home;
