import { useState, useEffect } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox';
import { fetchText, saveText, deleteText } from '@/utils/useSupabase';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import A4Landscape from './A4Landscape';
import DiagramBackgroundSVG from '@/data/DiagramBackgroundSVG';

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

  const diagramKey = `${diagramIndex + 1}`;
  const [textElements, setTextElements] = useState<TextElements>({});

  useEffect(() => {
    const loadTexts = async () => {
      if (user?.id) {
        const texts = await fetchText(user.id);
        const currentDiagramTexts = texts[`diagram${diagramIndex + 1}`];
        
        if (currentDiagramTexts) {
          setTextElements(currentDiagramTexts);
        } else {
          setTextElements({});
        }
      }
    };
  
    loadTexts();
  }, [user, diagramKey, diagramIndex]);

  const handleSave = async (keyName: string, newContent: string, newPosition: { x: number; y: number }, newSize: { width: string; height: string }) => {
    await saveText(user?.id || '', diagramIndex, keyName, newContent, newPosition, newSize);
  
    setTextElements((prev) => ({
      ...prev,
      [keyName]: {
        content: newContent,
        position: newPosition,
        size: newSize,
      },
    }));
  };

  const handleSaveAll = () => {
    Object.keys(textElements).forEach((key) => {
      const { content, position, size } = textElements[key];
      handleSave(key, content, position, size);
    });
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
    handleSave(newId, newElement.content, newElement.position, newElement.size);
  };

  return (
    <div className="relative w-full h-auto block">
      <div className="absolute top-4 right-20 z-10 flex space-x-4">
        <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleSaveAll}>
          Save Changes
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={addNewTextElement}>
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
        {/* Header Section */}
        <div className="h-[10rem] bg-gray-300 flex justify-between items-start px-2 py-2 z-10">
          <div className="flex flex-col">
            <p className="text-lg">{languageTexts?.lpwelle?.lebensplan} {user?.user_name}</p>
            <p className="text-lg">{`${diagramIndex + 1}. ${languageTexts?.lpwelle?.jahrsiebt || ''}`}: {dates?.[0]?.date} - {dates?.[7]?.date}</p>
          </div>
          <div className="flex flex-col text-right">
            <p>{languageTexts?.lpwelle?.[diagramKey]?.line1}</p>
            <p>{languageTexts?.lpwelle?.[diagramKey]?.line2}</p>
            <p>{languageTexts?.lpwelle?.[diagramKey]?.line3}</p>
            <p>{languageTexts?.lpwelle?.[diagramKey]?.line4}</p>
          </div>
        </div>
  
        {/* Text Elements Section */}
        {Object.keys(textElements).map((key) => {
          const { content, position, size } = textElements[key];
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
                deleteText(user?.id || '', diagramIndex, key);
              }}
              onSave={(newContent, newPosition, newSize) => handleSave(key, newContent, newPosition, newSize)}
            />
          );
        })}
  
        {/* Diagram Content Section */}
        <div className="relative h-[62%]">
          <div className="absolute top-0 w-full h-1/4 bg-yellow-200 flex items-center justify-between px-4 z-0">
            <p><span className="font-florinht3">0</span> {dates[4]?.age}.</p>
            <p>{dates[4]?.age}. <span className="font-florinht3">0</span></p>
          </div>
          <div className="absolute top-1/4 w-full h-1/4 bg-pink-200 flex items-center justify-between px-4 z-0">
            <p><span className="font-florinht3">3</span> {dates[3]?.age}.</p>
            <p>{dates[5]?.age}. <span className="font-florinht3">7</span></p>
          </div>
          <div className="absolute top-2/4 w-full h-1/4 bg-green-200 flex items-center justify-between px-4 z-0">
            <p><span className="font-florinht3">2</span> {dates[2]?.age}.</p>
            <p>{dates[6]?.age}. <span className="font-florinht3">8</span></p>
          </div>
          <div className="absolute bottom-0 w-full h-1/4 bg-blue-200 flex items-center justify-between px-4 z-0">
            <p><span className="font-florinht3">1</span> {dates[1]?.age}.</p>
            <p>{dates[7]?.age}. <span className="font-florinht3">9</span></p>
          </div>
  
          <DiagramBackgroundSVG />
        </div>
  
        {/* Date Position Section */}
        <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[0]?.date}</p>
        </div>
        <div className="absolute left-[12%] bottom-[22%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[1]?.date}</p>
        </div>
        <div className="absolute left-[17%] bottom-[47%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[2]?.date}</p>
        </div>
        <div className="absolute left-[22%] top-[20%] w-[10%] h-[10%] flex justify-center z-10">
          <p className="text-center">{dates[3]?.date}</p>
        </div>
        <div className="absolute right-[21%] top-[25%] w-[10%] h-[10%] flex justify-center z-10">
          <p className="text-center">{dates[4]?.date}</p>
        </div>
        <div className="absolute right-[17%] bottom-[42%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[5]?.date}</p>
        </div>
        <div className="absolute right-[12%] bottom-[17%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[6]?.date}</p>
        </div>
        <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[7]?.date}</p>
        </div>
  
        {/* Footer Section */}
        <div className="relative flex justify-between items-start bg-gray-200 pt-2 pb-24 px-8 mt-auto">
          <p>{languageTexts?.lpwelle?.bottomTextLeft}</p>
          <p>{languageTexts?.lpwelle?.bottomTextCenter}</p>
          <p></p>
          <p className="absolute bottom-[84%] right-0 text-sm text-gray-600">
            {languageTexts?.lpwelle?.copyright}
          </p>
        </div>
      </A4Landscape>
    </div>
  );
  
};

export default LpWelleContent;
