"use client"

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

interface User {
  id: string;
  uuid: string;
  user_name?: string;
  birth_date?: string;
  email: string;
  texts?: Record<string, any>;
  created_at: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  handleSave: (data: { userName: string; birthDate: string }) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      fetchUser();
    }
  }, []);
  
  const fetchUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      setError("Error fetching user");
      setLoading(false);
      return;
    }
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("lpwelle")
        .select("user_name, birth_date, texts")
        .eq("id", user.id)
        .single();
  
      if (profileError) {
        setError("Error fetching profile");
      } else {
        const mergedUser: User = {
          id: user.id,
          uuid: user.id,
          email: user.email || "",
          user_name: profile.user_name,
          birth_date: profile.birth_date,
          texts: profile.texts,
          created_at: user.created_at
        };
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
      }
    }
    setLoading(false);
  };

  const handleSave = useCallback(
    async (data: { userName: string; birthDate: string }) => {
      if (user) {
        try {
          const { error } = await supabase
            .from("lpwelle")
            .update({
              user_name: data.userName,
              birth_date: data.birthDate,
            })
            .eq("id", user.id);

          if (error) {
            console.error("Error updating profile:", error);
          } else {
            const updatedUser = { ...user, user_name: data.userName, birth_date: data.birthDate };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
    },
    [user]
  );

  const memoizedValue = useMemo(
    () => ({ user, loading, error, setUser, handleSave }),
    [user, loading, error, handleSave]
  );

  return (
    <UserContext.Provider value={memoizedValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
