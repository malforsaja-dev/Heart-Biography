// hooks/useLanguage.ts
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useLanguage = () => {
  // Retrieve language from localStorage or default to 'de'
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'de';
    }
    return 'de';
  });
  const [texts, setTexts] = useState<any>({});

  useEffect(() => {
    const loadTexts = async () => {
      try {
        console.log(`Loading language: ${language}`); // Debug log
        const response = await import(`../data/language/${language}.json`);
        setTexts(response.default);
        console.log('Texts loaded:', response.default); // Debug log
      } catch (error) {
        console.error('Error loading language file:', error);
      }
    };

    loadTexts();
  }, [language]);

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`); // Debug log
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      Cookies.set('language', lang, { expires: 365 }); // Persist language choice
    }
  };

  return { texts, changeLanguage };
};

export default useLanguage;
