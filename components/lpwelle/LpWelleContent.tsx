import { useState, useMemo, useEffect } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox';
import { saveText } from '@/utils/saveText';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useLanguage } from '@/context/LanguageContext';
import MainDiagramContent from '@/components/lpwelle/MainDiagramContent';
import DiagramBackgroundSVG from '@/data/DiagramBackgroundSVG';
import { useUser } from '@/context/UserContext';
import A4Landscape from './A4Landscape';

interface TextElement {
  content: string;
  position: { x: number; y: number };
  size: { width: string; height: string };
}

type TextElements = Record<string, TextElement>;

const LpWelleContent = () => {
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { getDatesForDiagram, maxDiagrams } = useDiagramDates();
  const dates = getDatesForDiagram(diagramIndex);
  const { texts: languageTexts } = useLanguage();
  const { user } = useUser();

  const diagramKey = `diagram${diagramIndex + 1}`;
  const diagramTexts = useMemo(() => user?.texts?.[diagramKey] || {}, [user, diagramKey]);
  const localDiagramTexts = languageTexts?.lpwelle?.[diagramIndex + 1] || {};

  const [textElements, setTextElements] = useState<TextElements>(diagramTexts);

  useEffect(() => {
    setTextElements(diagramTexts);
  }, [diagramTexts]);

  const handleSave = (keyName: string, newText: string) => {
    saveText(user?.id || '', diagramIndex, keyName, newText);
  };

  const addNewTextElement = () => {
    const newId = `text${Date.now()}`;
    const newElement = {
      content: 'New Text',
      position: { x: 250, y: 250 },
      size: { width: '200px', height: '70px' },
    };

    setTextElements((prev) => ({
      ...prev,
      [newId]: newElement,
    }));

    handleSave(newId, newElement.content);
  };

  return (
    <div className="relative w-full h-auto block">

      <div className="absolute top-4 right-20 z-10">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={addNewTextElement}
        >
          Add Text
        </button>
      </div>

      <div className="flex justify-center w-full items-center pt-20 py-2 z-0 relative bg-gray-100 mt-12">
        {Array.from({ length: maxDiagrams }).map((_, index) => (
          <button
            key={index}
            onClick={() => setDiagramIndex(index)}
            aria-label={`Go to diagram ${index + 1}`}
            className={`w-4 h-4 rounded-full mx-1 ${diagramIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
  
      <A4Landscape>
        <div className="h-[10rem] bg-gray-300 flex justify-between items-start px-2 py-2 z-10">
          <div className="flex flex-col">
            <p className="text-lg">{languageTexts?.lpwelle?.lebensplan}  {user?.first_name} {user?.last_name }</p>
            <p className="text-lg">{`${diagramIndex + 1}. ${languageTexts?.lpwelle?.jahrsiebt || ''}`}: {dates?.[0]?.date} - {dates?.[7]?.date}</p>
          </div>
          <div className="flex flex-col text-right">
            <p>{localDiagramTexts?.line1}</p>
            <p>{localDiagramTexts?.line2}</p>
            <p>{localDiagramTexts?.line3}</p>
            <p>{localDiagramTexts?.line4}</p>
          </div>
        </div>

        {Object.keys(textElements).map((key) => {
          const { content, position = { x: 50, y: 50 }, size = { width: '200px', height: '50px' } } = textElements[key];
          return (
            <DraggableTextBox
              key={key}
              id={parseInt(key.replace('text', ''))}
              content={content}
              defaultWidth={size.width}
              defaultHeight={size.height}
              initialPosition={position}
              onRemove={() => {
                const updatedElements = { ...textElements };
                delete updatedElements[key];
                setTextElements(updatedElements);
              }}
              onSave={(newContent) => handleSave(key, newContent)}
            />
          );
        })}

        <div className="relative h-[62%]">
          <MainDiagramContent
            texts={textElements}
            dates={dates}
            userId={user?.id || ''}
            diagramIndex={diagramIndex}
          />

          <div className="absolute inset-0">
            <DiagramBackgroundSVG />
          </div>
        </div>

        <div className="relative flex justify-between items-start bg-gray-200 pt-2 pb-24 px-8 mt-auto">
          <p className="text-left">{languageTexts?.lpwelle?.bottomTextLeft}</p>
          <p className="text-center">{languageTexts?.lpwelle?.bottomTextCenter}</p>
          <p></p>
          {/* <p className="absolute bottom-48 right-0 mb-2 mr-2 text-sm -rotate-90 transform origin-bottom-right"> */}
          <p className="absolute bottom-[84%] right-0 text-sm text-gray-600">
            {languageTexts?.lpwelle?.copyright}
          </p>
        </div>
      </A4Landscape>
    </div>
  );
  
};

export default LpWelleContent;