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
      Cookies.set('language', lang, { expires: 365 });
    }
  };

  return { texts, changeLanguage };
};

export default useLanguage;