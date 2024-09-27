
"use client"

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchUserData, savePageData } from '@/utils/useSupabase';
import { useUser } from '@/context/UserContext';

interface UserDataContextType {
  data: {
    LpWelle: any;
    Fotobook: any;
    WorkBench: any;
  };
  updatePageData: (page: 'LpWelle' | 'Fotobook' | 'WorkBench', newData: any) => void;
  saveAllData: () => void;
}

interface UserDataProviderProps {
  children: ReactNode;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [data, setData] = useState({
    LpWelle: {},
    Fotobook: {},
    WorkBench: {},
  });
  const { user } = useUser();

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        const userData = await fetchUserData(user.id);
        console.log('Fetched User Data:', userData);
        setData(userData);
      }
    };
  
    loadUserData();
  }, [user?.id]);

  const updatePageData = async (page: 'LpWelle' | 'Fotobook' | 'WorkBench', pageData: any) => {
    console.log('updatePageData called with pageData:', page, pageData);
    setData((prevData) => ({
      ...prevData,
      [page]: pageData,
    }));
    if (user?.id) {
      await savePageData(user.id, page, pageData);
      console.log('Data saved to Supabase for page:', page);
    }
  };

  const saveAllData = async () => {
    if (user?.id) {
      await savePageData(user.id, 'LpWelle', data.LpWelle);
      await savePageData(user.id, 'Fotobook', data.Fotobook);
      await savePageData(user.id, 'WorkBench', data.WorkBench);
    }
  };

  return (
    <UserDataContext.Provider value={{ data, updatePageData, saveAllData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
