"use client";

import { useState } from 'react';
import Image from 'next/image';
import A4Template from '@/app/components/A4Template';
import DraggableResizableBox from '@/app/components/DraggableResizableBox';
import { useLanguage } from '../context/LanguageContext';

const WorkBench = () => {
  const [elementsFront, setElementsFront] = useState([
    { id: 1, content: <p>Drag me on front!</p>, defaultWidth: '200px', defaultHeight: '50px' },
  ]);

  const [elementsBack, setElementsBack] = useState([
    { id: 1, content: <p>Drag me on back!</p>, defaultWidth: '200px', defaultHeight: '50px' },
  ]);

  const [isFrontSide, setIsFrontSide] = useState(true);
  const { texts } = useLanguage();

  const addTextElement = () => {
    const newElement = { id: Date.now(), content: <p>{texts.pages?.addText}</p>, defaultWidth: '200px', defaultHeight: '50px' };
    if (isFrontSide) {
      setElementsFront((prevElements) => [...prevElements, newElement]);
    } else {
      setElementsBack((prevElements) => [...prevElements, newElement]);
    }
  };

  const addImageElement = () => {
    const newElement = { id: Date.now(), content: <Image src="/smile.webp" alt={texts.pages?.addImage} width={100} height={100} />, defaultWidth: '100px', defaultHeight: '100px' };
    if (isFrontSide) {
      setElementsFront((prevElements) => [...prevElements, newElement]);
    } else {
      setElementsBack((prevElements) => [...prevElements, newElement]);
    }
  };

  const flipPage = () => {
    setIsFrontSide((prev) => !prev);
  };

  return (
    <>
      <div className="py-5 text-center">
        <button onClick={addTextElement} className="bg-blue-500 text-white px-4 py-2 mr-2">
          {texts.pages?.addText}
        </button>
        <button onClick={addImageElement} className="bg-green-500 text-white px-4 py-2 mr-2">
          {texts.pages?.addImage}
        </button>
        <button onClick={flipPage} className="bg-yellow-500 text-white px-4 py-2">
          {texts.pages?.flipPage}
        </button>
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
            <A4Template>{elementsFront.map((element) => (
              <DraggableResizableBox
                key={element.id}
                content={element.content}
                defaultWidth={element.defaultWidth}
                defaultHeight={element.defaultHeight}
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
            <A4Template>{elementsBack.map((element) => (
              <DraggableResizableBox
                key={element.id}
                content={element.content}
                defaultWidth={element.defaultWidth}
                defaultHeight={element.defaultHeight}
              />
            ))}
            </A4Template>
          </div>
        </div>
      </div>
      <div className='h-20'></div>
    </>
  );
};

export default WorkBench;
