
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import cookie from 'js-cookie';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error checking user:', error);
      } else {
        console.log('User found:', user);
        setUser(user);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        setUser(session.user);
      } else {
        console.log('No session found.');
      }
    };
  
    checkUserSession();
  }, []);

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error('Error signing in:', error);
    } else {
      setUser(data?.user);
  
      // Manually set the session cookie
      cookie.set('sb-access-token', data.session.access_token, { expires: 7 });
      
      // Reload or navigate to a different page
      window.location.reload();
      // window.location.href = '/lebensplan';
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      setUser(null);
      cookie.remove('sb-access-token');
      window.location.reload();
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="mb-4 p-3 w-full border rounded"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="mb-4 p-3 w-full border rounded"
          />
          <button 
            onClick={handleSignIn} 
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
        <p className="mb-6">You are logged in. You can now access protected pages.</p>
        <button 
          onClick={handleLogout} 
          className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Auth;
