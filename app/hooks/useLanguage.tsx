
import { useState, useEffect } from 'react';

const useLanguage = () => {
  const [language, setLanguage] = useState('en');
  const [texts, setTexts] = useState<any>({});

  useEffect(() => {
    const loadTexts = async () => {
      const response = await import(`../data/language/${language}.json`);
      setTexts(response.default);
    };
    loadTexts();
  }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return { texts, changeLanguage };
};

export default useLanguage;
