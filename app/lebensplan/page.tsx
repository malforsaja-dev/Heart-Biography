"use client"

import { useState } from 'react';
import useDiagramDates from '../hooks/useDiagramDates';
import { useLanguage } from '../context/LanguageContext';
import MainDiagramContent from '../components/MainDiagramContent';
import DiagramBackgroundSVG from '../data/DiagramBackgroundSVG';
import clientData from '../data/clientData.json';

const LpWelle = () => {
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { dates, maxDiagrams } = useDiagramDates(diagramIndex);
  const { texts: languageTexts } = useLanguage();
  
  // Merge the static texts with the user-specific texts
  const texts = {
    ...languageTexts?.lpwelle,
    ...clientData.texts
  };

  const currentPageTexts = texts?.[diagramIndex + 1];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Pagination bullets at the top */}
      <div className="flex justify-center items-center py-2 z-20 relative bg-gray-100">
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

      <div className="h-[8rem] bg-gray-300 flex justify-between items-center px-4 pb-4">
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

      <MainDiagramContent texts={texts} dates={dates} />
      
      <DiagramBackgroundSVG />

      <div className="relative flex justify-between items-center bg-gray-200 py-2 px-8 mt-auto">
        <p>{texts?.bottomTextLeft}</p>
        <p>{texts?.bottomTextCenter}</p>
        <p className="text-sm text-center">{texts?.copyright}</p>
      </div>
    </div>
  );
};

export default LpWelle;
