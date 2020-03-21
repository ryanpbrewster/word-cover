import React, { useEffect, useState } from 'react';
import './App.css';
import { useFirebase } from './fb';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import WaitingRoom from './WaitingRoom';

function App() {
  const app = useFirebase();
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    app.auth().onAuthStateChanged((user: any) => setUid(user?.uid ?? null));
  }, [app]);
  
  if (!uid) {
    return <p>loading...</p>;
  }

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
