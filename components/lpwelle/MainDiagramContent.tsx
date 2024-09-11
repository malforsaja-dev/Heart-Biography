import { useState } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox'; // The updated DraggableTextBox component
import { saveText } from '@/utils/saveText';

interface MainDiagramContentProps {
  texts: Record<string, any>;
  dates: string[];
  userId: string;
  diagramIndex: number;
}

const MainDiagramContent: React.FC<MainDiagramContentProps> = ({ texts = {}, dates = [], userId, diagramIndex }) => {
  const [textElements, setTextElements] = useState(texts || {});

  // Function to handle saving text content when updated
  const handleSave = (keyName: string, newText: string) => {
    saveText(userId, diagramIndex, keyName, newText); // Save text content using the existing saveText function
  };

  // Function to add a new text element
  const addNewTextElement = () => {
    const newId = `text${Date.now()}`; // Generate a unique ID
    const newElement = {
      content: 'New Text',
      position: { x: 50, y: 50 }, // Default position
      size: { width: '200px', height: '50px' }, // Default size
    };
    setTextElements((prev) => ({
      ...prev,
      [newId]: newElement,
    }));
  };

  return (
    <div className="relative h-[calc(100vh-16.5rem)] overflow-hidden">
      {/* Add Text Button */}
      {/* <button 
        className="absolute top-2 right-2 bg-blue-500 text-white py-2 px-4 rounded z-10"
        onClick={addNewTextElement}
      >
        Add Text
      </button> */}
      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200 z-0"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200 z-0"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200 z-0"></div>


      {/* Dynamically render DraggableTextBox for each text */}
      {Object.keys(textElements).map((key) => {
        const { content, position = { x: 50, y: 50 }, size = { width: '200px', height: '50px' } } = textElements[key]; // Default positions and sizes
        return (
          <DraggableTextBox
            key={key}
            id={parseInt(key.replace('text', ''))} // Convert text ID to a number
            content={content}
            defaultWidth={size.width}
            defaultHeight={size.height}
            initialPosition={position}
            onRemove={() => {
              // Logic to remove a text field
              const updatedElements = { ...textElements };
              delete updatedElements[key]; // Remove the text element
              setTextElements(updatedElements); // Update the state
            }}
            onSave={(newContent) => handleSave(key, newContent)} // Save new content to Supabase
          />
        );
      })}

      {/* Date labels stay fixed */}
      <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[0]}</p>
      </div>
      <div className="absolute left-[13%] bottom-[22%] w-[10%] h-[10%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[1]}</p>
      </div>
      <div className="absolute left-[17.5%] bottom-[47%] w-[10%] h-[10%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[2]}</p>
      </div>
      <div className="absolute left-[22%] top-[20%] w-[10%] h-[10%] flex justify-center z-10">
        <p className="text-center">{dates[3]}</p>
      </div>
      <div className="absolute right-[22.5%] top-[25%] w-[10%] h-[10%] flex justify-center z-10">
        <p className="text-center">{dates[4]}</p>
      </div>
      <div className="absolute right-[18%] bottom-[42%] w-[10%] h-[10%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[5]}</p>
      </div>
      <div className="absolute right-[13%] bottom-[17%] w-[10%] h-[10%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[6]}</p>
      </div>
      <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center z-10">
        <p className="text-center">{dates[7]}</p>
      </div>
    </div>
  );
};

export default MainDiagramContent;
