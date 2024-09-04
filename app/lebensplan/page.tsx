"use client";

import { useState, useEffect } from 'react';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useLanguage } from '@/context/LanguageContext';
import MainDiagramContent from '@/components/MainDiagramContent';
import DiagramBackgroundSVG from '@/data/DiagramBackgroundSVG';
import { supabase } from '@/utils/supabase/client';

const LpWelle = () => {
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { dates, maxDiagrams } = useDiagramDates(diagramIndex);
  const { texts: languageTexts } = useLanguage();
  const [data, setData] = useState({
    birth_date: null,
    texts: {},
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from('lpwelle')
          .select('birth_date, texts')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setData(data);
        }
      }
    };

    fetchData();
  }, []);

  const texts = {
    ...languageTexts?.lpwelle,
    ...data.texts,
  };

  const currentPageTexts = texts?.[diagramIndex + 1];

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex justify-center items-center py-2 z-10 relative bg-gray-100">
        {Array.from({ length: maxDiagrams }).map((_, index) => (
          <button
            key={index}
            onClick={() => setDiagramIndex(index)}
            aria-label={`Go to diagram ${index + 1}`}
            className={`w-4 h-4 rounded-full mx-1 ${
              diagramIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="h-[8rem] bg-gray-300 flex justify-between items-center px-4 pb-4 z-0">
        <div className="flex flex-col text-left">
          <p className="text-lg font-bold">{texts?.lebensplan}</p>
          <p className="text-lg">{`${diagramIndex + 1}. ${texts?.jahrsiebt}`}</p>
        </div>
        <div className="flex flex-col text-right">
          <p>{currentPageTexts?.line1}</p>
          <p>{currentPageTexts?.line2}</p>
          <p>{currentPageTexts?.line3}</p>
          <p>{currentPageTexts?.line4}</p>
        </div>
      </div>

      <MainDiagramContent
        texts={texts}
        dates={dates}
        userId={userId as string}
        diagramIndex={diagramIndex}
      />
      
      <DiagramBackgroundSVG />

      <div className="relative flex justify-between items-start bg-gray-200 pt-2 pb-24 px-8 mt-auto">
  <p className="text-left">{texts?.bottomTextLeft}</p>
  <p className="text-center">{texts?.bottomTextCenter}</p>
  <p></p>
  
  <p className="absolute bottom-48 right-0 mb-2 mr-2 text-sm -rotate-90 transform origin-bottom-right">
    {texts?.copyright}
  </p>
</div>
    </div>
  );
};

export default LpWelle;
