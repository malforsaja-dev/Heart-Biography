import { useState, useMemo, useEffect } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox'; // Import the draggable component
import { saveText } from '@/utils/saveText'; // Import save logic for Supabase
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

  // Memoize diagramTexts to prevent unnecessary re-renders
  const diagramKey = `diagram${diagramIndex + 1}`;
  const diagramTexts = useMemo(() => user?.texts?.[diagramKey] || {}, [user, diagramKey]);
  const localDiagramTexts = languageTexts?.lpwelle?.[diagramIndex + 1] || {};

  // State for text elements
  const [textElements, setTextElements] = useState<TextElements>(diagramTexts);

  // Effect to update text elements when diagram changes
  useEffect(() => {
    setTextElements(diagramTexts);
  }, [diagramTexts]);

  // Function to handle saving text content when updated
  const handleSave = (keyName: string, newText: string) => {
    saveText(user?.id || '', diagramIndex, keyName, newText); // Save text content using Supabase
  };

  // Function to add a new text element
  const addNewTextElement = () => {
    const newId = `text${Date.now()}`; // Generate a unique ID
    const newElement = {
      content: 'New Text',
      position: { x: 250, y: 250 }, // Default position
      size: { width: '200px', height: '70px' }, // Default size
    };

    // Update the state with the new text element
    setTextElements((prev) => ({
      ...prev,
      [newId]: newElement,
    }));

    // Optionally, update the database (Supabase) here if necessary
    handleSave(newId, newElement.content);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Add Text Button at the Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={addNewTextElement}
        >
          Add Text
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center py-2 z-10 relative bg-gray-100 mt-12"> {/* Added margin for space between Add Text and Nav buttons */}
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

        {/* Dynamically render DraggableTextBox for each text */}
        {Object.keys(textElements).map((key) => {
          const { content, position = { x: 50, y: 50 }, size = { width: '200px', height: '50px' } } = textElements[key];
          return (
            <DraggableTextBox
              key={key}
              id={parseInt(key.replace('text', ''))} // Convert text ID to a number
              content={content}
              defaultWidth={size.width}
              defaultHeight={size.height}
              initialPosition={position}
              onRemove={() => {
                const updatedElements = { ...textElements };
                delete updatedElements[key]; // Remove the text element
                setTextElements(updatedElements); // Update the state
              }}
              onSave={(newContent) => handleSave(key, newContent)} // Save new content to Supabase
            />
          );
        })}

        <MainDiagramContent
          texts={textElements}
          dates={dates}
          userId={user?.id || ''}
          diagramIndex={diagramIndex}
        />

        <DiagramBackgroundSVG />

        {/* Bottom Fixed Section */}
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
