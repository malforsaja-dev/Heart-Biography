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
    firstName: string,
    lastName: string,
    birthDate: string
  ) => {
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
        console.error("Error registering:", error);
      } else {
        const user = data.user;
        if (user) {
          setUser({
            id: user.id,
            uuid: user.id,
            email: user.email || '',
            first_name: firstName,
            last_name: lastName,
            birth_date: birthDate,
            created_at: new Date().toISOString(),
          });
          router.push("/");
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
        router.push("/welcome");
        cookie.remove("sb-access-token");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleRegister, handleLogout };
};
