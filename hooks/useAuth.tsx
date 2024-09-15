import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/utils/supabase/client';
import cookie from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Error signing in:", error);
      } else {
        const session = data.session;
        if (session) {
          cookie.set("sb-access-token", session.access_token, { expires: 7 });
          const { data: profile, error: profileError } = await supabase
            .from("lpwelle")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile data:", profileError);
          } else {
            setUser({ ...session.user, ...profile });
          }
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    userName: string,
    birthDate: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error("Error registering:", error);
      } else {
        const user = data.user;
        if (user) {
          const { error: insertError } = await supabase
            .from('lpwelle')
            .insert({
              id: user.id,
              user_name: userName,
              birth_date: birthDate,
              email: user.email,
              texts: {},
              created_at: new Date().toISOString(),
            });
  
          if (insertError) {
            console.error("Error inserting into lpwelle:", insertError);
          } else {
            setUser({
              id: user.id,
              uuid: user.id,
              email: user.email || '',
              user_name: userName,
              birth_date: birthDate,
              created_at: new Date().toISOString(),
            });
            router.push("/");
          }
        }
      }
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        cookie.remove("sb-access-token", { path: '/' });
        router.push("/welcome");
      } else {
        console.error("Error logging out:", error);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleRegister, handleLogout };
};
