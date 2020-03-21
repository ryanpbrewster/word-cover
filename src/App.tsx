import React, { useEffect, useState } from 'react';
import './App.css';
import { useFirebase } from './fb';

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
    <div className="App">
      <p>Hello, World!</p>
    </div>
  );
}

export default App;
