import { useState } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox';
import { saveText } from '@/utils/saveText';

interface MainDiagramContentProps {
  texts: Record<string, any>;
  dates: string[];
  userId: string;
  diagramIndex: number;
}

const MainDiagramContent: React.FC<MainDiagramContentProps> = ({ texts = {}, dates = [], userId, diagramIndex }) => {
  const [textElements, setTextElements] = useState(texts || {});

  const handleSave = (keyName: string, newText: string) => {
    saveText(userId, diagramIndex, keyName, newText);
  };


  return (
    <div className="h-full overflow-hidden z-10">

      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200 z-0"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200 z-0"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200 z-0"></div>


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
