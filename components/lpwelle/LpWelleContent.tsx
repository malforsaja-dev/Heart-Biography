import { useState, useEffect, useMemo } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { useUser } from '@/context/UserContext';
import { useInsertText } from '@/hooks/useInsertText';
import { savePageData, deleteText } from '@/utils/useSupabase';
import InsertText from '@/components/insertText/InsertText';
import A4Landscape from '../A4Landscape';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useLanguage } from '@/context/LanguageContext';
import DiagramBackgroundSVG from '@/data/DiagramBackgroundSVG';

const colors = [
  "#92d4ee", "#b3e2a0", "#ec86b9", "#f8d24a", "#f8d24a",
  "#f8d24a", "#f3b5d4", "#d1edc3", "#bde5f5", "#bde5f5",
  "#d1edc3", "#f3b5d4"
];

const LpWelleContent = () => {
  const { data, updatePageData } = useUserData();
  const { elements, setElements, addElement, updateElement, updateElementPosition, updateElementStyle, deleteElement } = useInsertText();
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { getDatesForDiagram, maxDiagrams } = useDiagramDates();
  const dates = getDatesForDiagram(diagramIndex);
  const { texts: languageTexts } = useLanguage();
  const { user } = useUser();

  // Memoized LpWelleData to avoid unnecessary renders
  const LpWelleData = useMemo(() => data.LpWelle || {}, [data.LpWelle]);

  useEffect(() => {
    const currentDiagram = `diagram${diagramIndex + 1}`;
    console.log('Fetching Elements for Diagram:', currentDiagram, 'Data:', LpWelleData[currentDiagram]);
    if (LpWelleData[currentDiagram]) {
      setElements(LpWelleData[currentDiagram]);
    } else {
      setElements([]);
    }
  }, [LpWelleData, diagramIndex, setElements]);
  

  useEffect(() => {
    console.log('Updated Elements in InsertText component:', elements);
  }, [elements]);

  // Save element changes to context and database
  const handleSave = async (id: string, newContent: string, newSize?: { width: string; height: string }) => {
    console.log('handleSave called with:', { id, newContent, newSize });
    const element = elements.find(el => el.id === id);
    if (!element) {
      console.log('Element not found for id:', id);
      return;
    }
  
    const size = newSize ?? element.size;
    console.log('Updating element size in handleSave:', size);
  
    // Update element in state with new content and size
    updateElement(id, newContent, size);
  
    // Ensure state update propagates correctly
    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, content: newContent, size, style: { ...el.style } } : el
    );
    console.log('Updated Elements before saving to context in handleSave:', updatedElements);
  
    // Update the context state and save to database
    updatePageData('LpWelle', { ...LpWelleData, [`diagram${diagramIndex + 1}`]: updatedElements });
    console.log('Updated LpWelleData in context in handleSave:', { ...LpWelleData, [`diagram${diagramIndex + 1}`]: updatedElements });
  
    // Save to Supabase
    await savePageData(user?.id || '', 'LpWelle', { ...LpWelleData, [`diagram${diagramIndex + 1}`]: updatedElements });
    console.log('Data saved to Supabase in handleSave');
  };
  
  

  // Add a new text element
  const addNewTextElement = () => {
    addElement();
    console.log('After Adding Element:', elements);
  };

  console.log('Elements:', elements, Array.isArray(elements));

  

  return (
    <div className="relative w-full h-auto block">
      <div className="absolute top-4 right-20 z-10 flex space-x-4">
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
            <p>{languageTexts?.lpwelle?.[`${diagramIndex + 1}`]?.line1}</p>
            <p>{languageTexts?.lpwelle?.[`${diagramIndex + 1}`]?.line2}</p>
            <p>{languageTexts?.lpwelle?.[`${diagramIndex + 1}`]?.line3}</p>
            <p>{languageTexts?.lpwelle?.[`${diagramIndex + 1}`]?.line4}</p>
          </div>
        </div>

        {/* InsertText Elements Section */}
        {Array.isArray(elements) && elements.map((element) => (
          <InsertText
  key={element.id}
  id={element.id}
  x={element.x}
  y={element.y}
  rotation={element.rotation}
  size={element.size}
  content={element.content}
  backgroundColor={element.style.backgroundColor}
  borderColor={element.style.borderColor}
  borderSize={element.style.borderSize}
  isBgTransparent={element.style.isBgTransparent}
  isBorderTransparent={element.style.isBorderTransparent}
  onContentChange={(id, content) => {
    console.log('onContentChange called with:', id, content);
    handleSave(id, content, element.size);
  }}
  onPositionChange={(id, x, y, rotation) => {
    console.log('onPositionChange called with:', id, x, y, rotation);
    updateElementPosition(id, x, y, rotation);
  }}
  onStyleChange={(id, newStyle) => {
    console.log('onStyleChange called with:', id, newStyle);
    updateElementStyle(id, newStyle);
  }}
  onDelete={(id: string) => {
    console.log('onDelete called with:', id);
    deleteElement(id);
    deleteText(user?.id || '', 'LpWelle', diagramIndex, `text${id}`);
  }}
  className="box-shadow"
/>
        ))}

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
          <DiagramBackgroundSVG color={colors[diagramIndex % colors.length]} />
        </div>

        {/* Date Position Section */}
        <div className="absolute left-[1%] bottom-[17%] w-[1%] h-[5%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[0]?.date}</p>
        </div>
        <div className="absolute left-[13%] bottom-[29.5%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[1]?.date}</p>
        </div>
        <div className="absolute left-[17.5%] bottom-[45%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[2]?.date}</p>
        </div>
        <div className="absolute left-[22%] top-[33%] w-[10%] h-[10%] flex justify-center z-10">
          <p className="text-center">{dates[3]?.date}</p>
        </div>
        <div className="absolute right-[22%] top-[35.5%] w-[10%] h-[10%] flex justify-center z-10">
          <p className="text-center">{dates[4]?.date}</p>
        </div>
        <div className="absolute right-[17.5%] bottom-[42.5%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[5]?.date}</p>
        </div>
        <div className="absolute right-[12%] bottom-[27%] w-[10%] h-[10%] flex flex-col justify-center z-10">
          <p className="text-center">{dates[6]?.date}</p>
        </div>
        <div className="absolute -right-5 bottom-[17%] w-[10%] h-[5%] flex flex-col justify-center z-10">
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
