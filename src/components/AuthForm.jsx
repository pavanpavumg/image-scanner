import React, {useState} from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthForm(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [mode,setMode] = useState('signin');
  const [error,setError] = useState(null);

  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      if(mode === 'signin') await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    }catch(err){ setError(err.message) }
  }

  return (
    <div className="auth-card">
      <h2>{mode==='signin' ? 'Sign in' : 'Create account'}</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div style={{marginTop:8}}><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <div style={{marginTop:12}}><button type="submit">{mode==='signin' ? 'Sign in' : 'Create'}</button></div>
        <div style={{marginTop:8}}>
          <button type="button" onClick={()=>setMode(mode==='signin'?'signup':'signin')}>{mode==='signin' ? 'Create account' : 'Have an account? Sign in'}</button>
        </div>
        {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
      </form>
    </div>
  )
}
