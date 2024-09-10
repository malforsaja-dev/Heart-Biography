import { useState } from 'react';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useLanguage } from '@/context/LanguageContext';
import MainDiagramContent from '@/components/MainDiagramContent';
import DiagramBackgroundSVG from '@/data/DiagramBackgroundSVG';
import { useUser } from '@/context/UserContext';
import A4Landscape from './A4Landscape';

const LpWelleContent = () => {
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { getDatesForDiagram, maxDiagrams } = useDiagramDates();
  const dates = getDatesForDiagram(diagramIndex); 
  const { texts: languageTexts } = useLanguage();
  const { user } = useUser();

  const diagramKey = `diagram${diagramIndex + 1}`;
  const diagramTexts = user?.texts?.[diagramKey] || {};
  const localDiagramTexts = languageTexts?.lpwelle?.[diagramIndex + 1] || {};

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Navigation Buttons */}
      <div className="flex justify-center items-center py-2 z-10 relative bg-gray-100">
        {Array.from({ length: maxDiagrams }).map((_, index) => (
          <button
            key={index}
            onClick={() => setDiagramIndex(index)}
            aria-label={`Go to diagram ${index + 1}`}
            className={`w-4 h-4 rounded-full mx-1 ${diagramIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* A4 Landscape Paper */}
      <A4Landscape>
        <div className="h-[8rem] bg-gray-300 flex justify-between items-center px-4 pb-4 z-0">
          <div className="flex flex-col text-left">
            <p className="text-lg font-bold">{languageTexts?.lpwelle?.lebensplan}</p>
            <p className="text-lg">{`${diagramIndex + 1}. ${languageTexts?.lpwelle?.jahrsiebt || ''}`}</p>
          </div>
          <div className="flex flex-col text-right">
            <p>{localDiagramTexts?.line1}</p>
            <p>{localDiagramTexts?.line2}</p>
            <p>{localDiagramTexts?.line3}</p>
            <p>{localDiagramTexts?.line4}</p>
          </div>
        </div>

        <MainDiagramContent
          texts={diagramTexts}
          dates={dates}
          userId={user?.id || ''}
          diagramIndex={diagramIndex}
        />

        <DiagramBackgroundSVG />

        <div className="relative flex justify-between items-start bg-gray-200 pt-2 pb-24 px-8 mt-auto">
          <p className="text-left">{languageTexts?.lpwelle?.bottomTextLeft}</p>
          <p className="text-center">{languageTexts?.lpwelle?.bottomTextCenter}</p>
          <p></p>
          <p className="absolute bottom-48 right-0 mb-2 mr-2 text-sm -rotate-90 transform origin-bottom-right">
            {languageTexts?.lpwelle?.copyright}
          </p>
        </div>
      </A4Landscape>
    </div>
  );
};

export default LpWelleContent;
