"use client";

import A4Template from '@/components/A4Template';
import DraggableResizableBox from '@/components/DraggableResizableBox';
import UploadImage from '@/components/UploadImage';
import { useLanguage } from '@/context/LanguageContext';
import { useWorkbenchElements } from '@/hooks/useWorkbenchElements';

const WorkBench = () => {
  const { texts } = useLanguage();
  const {
    elementsFront,
    elementsBack,
    isFrontSide,
    addTextElement,
    addImageElement,
    updateElementPosition,
    updateElementSize,
    removeElement,
    saveToDatabase,
    flipPage,
  } = useWorkbenchElements();

  const handleUploadSuccess = (url: string) => {
    addImageElement(url); // Add the image element correctly
  };

  return (
    <>
      <div className="py-5 text-center">
        <button onClick={addTextElement} className="bg-blue-500 text-white px-4 py-2 mr-2">
          {texts.fotobook?.addText}
        </button>
        <button onClick={flipPage} className="bg-yellow-500 text-white px-4 py-2">
          {texts.fotobook?.flipPage}
        </button>
        <button onClick={saveToDatabase} className="bg-green-500 text-white px-4 py-2 mr-2">
          Save Page
        </button>
        <UploadImage onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="relative w-[210mm] h-[297mm] mx-auto" style={{ perspective: '1000px' }}>
        <div
          className={`relative w-full h-full transition-transform duration-700`}
          style={{
            transform: isFrontSide ? 'rotateY(0deg)' : 'rotateY(180deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute w-full h-full top-0 left-0" style={{ backfaceVisibility: 'hidden' }}>
            <A4Template>
              {elementsFront.map((element) => (
                <DraggableResizableBox
                  key={element.id}
                  id={element.id}
                  content={element.content}
                  defaultWidth={element.defaultWidth}
                  defaultHeight={element.defaultHeight}
                  initialPosition={{ x: element.x, y: element.y }}
                  onRemove={removeElement}
                  onPositionChange={updateElementPosition}
                  onSizeChange={updateElementSize}
                  type={element.type} // Ensure type is passed correctly
                />
              ))}
            </A4Template>
          </div>
          <div
            className="absolute w-full h-full top-0 left-0"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <A4Template>
              {elementsBack.map((element) => (
                <DraggableResizableBox
                  key={element.id}
                  id={element.id}
                  content={element.content}
                  defaultWidth={element.defaultWidth}
                  defaultHeight={element.defaultHeight}
                  initialPosition={{ x: element.x, y: element.y }}
                  onRemove={removeElement}
                  onPositionChange={updateElementPosition}
                  onSizeChange={updateElementSize}
                  type={element.type}
                />
              ))}
            </A4Template>
          </div>
        </div>
      </div>
      <div className="h-20"></div>
    </>
  );
};

export default WorkBench;
