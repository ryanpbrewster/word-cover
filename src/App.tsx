import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import WaitingRoom from './WaitingRoom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/wait/:gameId">
          <WaitingRoom />
        </Route>
        <Route>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
