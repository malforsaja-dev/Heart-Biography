import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import cookie from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch user if they are on a protected route (not '/authenticate' or '/welcome')
      const unprotectedPaths = ['/welcome', '/authenticate'];
      if (unprotectedPaths.includes(pathname)) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('lpwelle')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
          } else {
            setUser({ ...user, ...profile });
          }
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  const handleSave = async (data: { firstName: string; lastName: string; birthDate: string }) => {
    try {
      const { error } = await supabase
        .from('lpwelle')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate,
        })
        .eq('id', user?.id);
  
      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setUser({ ...user, ...data });
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error);
      } else {
        const session = data.session;
        if (session) {
          cookie.set('sb-access-token', session.access_token, { expires: 7 });
  
          const { data: profile, error: profileError } = await supabase
            .from('lpwelle')
            .select('*')
            .eq('id', session.user.id)
            .single();
  
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
          } else {
            setUser({ ...session.user, ...profile });
          }
          router.push('/');
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
          router.push('/');
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
        router.push('/welcome');
        cookie.remove('sb-access-token');
      }
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleRegister, handleLogout, handleSave };
};
