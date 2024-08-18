
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import A4Template from '@/app/components/A4Template';
import DraggableResizableBox from '@/app/components/DraggableResizableBox';

const WorkBench = () => {
  const [elements, setElements] = useState([
    { id: 1, content: <p>Drag me!</p>, defaultWidth: '200px', defaultHeight: '50px' },
  ]);

  const addTextElement = () => {
    setElements([...elements, { id: elements.length + 1, content: <p>New Text Element</p>, defaultWidth: '200px', defaultHeight: '50px' }]);
  };

  const addImageElement = () => {
    setElements([...elements, { id: elements.length + 1, content: <Image src="/smile.webp" alt="Image" width={100} height={100} />, defaultWidth: '100px', defaultHeight: '100px' }]);
  };

  return (
    <>
      <div className="mb-5 text-center">
        <button onClick={addTextElement} className="bg-blue-500 text-white px-4 py-2 mr-2">Add Text</button>
        <button onClick={addImageElement} className="bg-green-500 text-white px-4 py-2">Add Image</button>
      </div>
      <A4Template>
        {elements.map((element) => (
          <DraggableResizableBox
            key={element.id}
            content={element.content}
            defaultWidth={element.defaultWidth}
            defaultHeight={element.defaultHeight}
          />
        ))}
      </A4Template>
    </>
  );
};

export default WorkBench;
