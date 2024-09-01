"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import cookie from 'js-cookie';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error checking user:', error);
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setIsVerified(user.email_confirmed_at !== null); // Check if email is verified
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Set the session token in the cookie
        cookie.set('sb-access-token', session.access_token, { expires: 7 });
        window.location.reload();
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error);
    } else {
        const { user } = data;
        if (user) {
            if (!user.email_confirmed_at) {
                alert("Your email is not verified. Please check your inbox and verify your email.");
                // Optional: Redirect user to a verification page or show a more detailed message.
            } else {
                setUser(user);
                cookie.set('sb-access-token', data.session.access_token, { expires: 7 });
                window.location.reload();
            }
        }
    }
}

async function handleRegister() {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
      },
    },
  });

  if (error) {
    console.error('Error registering:', error);
  } else {
    const user = data.user;
    if (user) {
      setUser(user);

      // Wait for the session to be fully established
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;

      if (session) {
        // Set the session token in the cookie
        cookie.set('sb-access-token', session.access_token, { expires: 7 });

        // Insert user data into the database
        const { error: insertError } = await supabase
          .from('lpwelle')
          .insert([
            {
              id: user.id,
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              birth_date: birthDate,
            },
          ]);

        if (insertError) {
          console.error('Error inserting user data:', insertError);
        } else {
          // Redirect or reload the page to ensure session is fully recognized
          window.location.reload();
        }
      } else {
        console.error('Session not found after signup');
      }
    }
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
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isRegistering ? 'Register' : 'Sign In'}
          </h2>
          {isRegistering && (
            <>
              <input 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="mb-4 p-3 w-full border rounded"
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="mb-4 p-3 w-full border rounded"
              />
              <input 
                type="date" 
                placeholder="Birth Date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                className="mb-4 p-3 w-full border rounded"
              />
            </>
          )}
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
            onClick={isRegistering ? handleRegister : handleSignIn} 
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="w-full p-3 mt-4 text-center text-blue-500 hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
        {isVerified ? (
          <p className="mb-6">You are logged in. You can now access protected pages.</p>
        ) : (
          <p className="mb-6 text-red-500">You are logged in but your email is not verified. Please check your email to verify your account and try again.</p>
        )}
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
