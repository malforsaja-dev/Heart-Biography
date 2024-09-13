import { useState } from 'react';
import DraggableTextBox from '@/components/lpwelle/DraggableTextBox';
import { saveText } from '@/utils/saveText';

interface DateWithAge {
  date: string;
  age: number;
}

interface MainDiagramContentProps {
  texts: Record<string, any>;
  dates: DateWithAge[];
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

      <div className="absolute top-0/4 w-full h-1/4 bg-yellow-200 flex items-center justify-between px-4 z-0">
        <p><span className='font-florinht3'>0</span> {dates[4]?.age}.</p>
        <p>{dates[4]?.age}. <span className='font-florinht3'>0</span></p>
      </div>
      <div className="absolute top-1/4 w-full h-1/4 bg-pink-200 flex items-center justify-between px-4 z-0">
        <p><span className='font-florinht3'>3</span> {dates[3]?.age}.</p>
        <p>{dates[5]?.age}. <span className='font-florinht3'>7</span></p>
      </div>
      <div className="absolute top-2/4 w-full h-1/4 bg-green-200 flex items-center justify-between px-4 z-0">
        <p><span className='font-florinht3'>2</span> {dates[2]?.age}.</p>
        <p>{dates[6]?.age}. <span className='font-florinht3'>8</span></p>
      </div>
      <div className="absolute bottom-0 w-full h-1/4 bg-blue-200 flex items-center justify-between px-4 z-0">
        <p><span className='font-florinht3'>1</span> {dates[1]?.age}.</p>
        <p>{dates[7]?.age}. <span className='font-florinht3'>9</span></p>
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
    </div>
  );
};

export default MainDiagramContent;
