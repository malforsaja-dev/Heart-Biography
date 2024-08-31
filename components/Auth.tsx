"use client";

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
    } else {
      const user = data?.user;
      console.log('Signed in successfully!', user);
    }
  }

  return (
    <div className='bg-gray-100 flex justify-around'>
      <div className=" ml-56 pt-20 flex flex-col gap-4">
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleSignIn}>Sign In</button>
      </div>
      <div className="pt-60">
        <p className="text-3xl">Logo</p>
        <p className="mt-10">description</p>
        <p className="mt-10">nice text</p>
        <p className="mt-10">bla bla</p>
      </div>
    </div>

  );
}

export default Auth;
