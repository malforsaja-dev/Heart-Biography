import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import cookie from 'js-cookie';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          if (error.name === 'AuthSessionMissingError') {
            // No active session
            return;
          } else {
            console.error('Error checking user:', error);
          }
          return;
        }

        if (user) {
          setUser(user);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            cookie.set('sb-access-token', session.access_token, { expires: 7 });
            setUser(session.user);
          }
        });

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } finally {
        setLoading(false);
      }
    };

    handleAuthStateChange();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error);
      } else {
        const { user } = data;
        if (user) {
          cookie.set('sb-access-token', data.session.access_token, { expires: 7 });
          setUser(user);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string, birthDate: string) => {
    setLoading(true);
    try {
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
          const sessionResponse = await supabase.auth.getSession();
          const session = sessionResponse.data.session;

          if (session) {
            cookie.set('sb-access-token', session.access_token, { expires: 7 });
            setUser(user);

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
            }
          } else {
            console.error('Session not found after signup');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      } else {
        setUser(null);
        cookie.remove('sb-access-token');
      }
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleRegister, handleLogout };
};