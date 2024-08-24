
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext<any>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  const [texts, setTexts] = useState<any>({});

  useEffect(() => {
    const loadTexts = async () => {
      try {
        const response = await import(`../data/language/${language}.json`);
        setTexts(response.default);
      } catch (error) {
        console.error('Error loading language file:', error);
      }
    };

    loadTexts();
  }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ texts, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
