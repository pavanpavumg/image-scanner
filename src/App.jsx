import React, {useEffect, useState} from 'react';
import { auth } from './firebaseConfig';
import AuthForm from './components/AuthForm';
import UploadPanel from './components/UploadPanel';
import Gallery from './components/Gallery';

export default function App(){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(u=> setUser(u));
    return () => unsub();
  },[]);

  return (
    <div className="app-root">
      <header className="header">
        <h1>Scanner App</h1>
        {user && <div>Signed in: {user.email}</div>}
      </header>
      <main className="container">
        {!user ? <AuthForm /> : (
          <>
            <UploadPanel />
            <hr />
            <Gallery />
          </>
        )}
      </main>
    </div>
  )
}
