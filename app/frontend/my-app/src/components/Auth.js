// src/components/Auth.js
import React, { useState } from 'react';
import { auth } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const signUp = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => setUser(userCredential.user))
      .catch(error => console.error(error));
  };

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => setUser(userCredential.user))
      .catch(error => console.error(error));
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={signIn}>Sign In</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
