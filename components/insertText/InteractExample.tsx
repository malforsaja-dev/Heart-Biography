
"use client"

import React from 'react';
import InsertText from '@/components/insertText/InsertText';
import { useInsertText } from '@/hooks/useInsertText';

const InteractExample: React.FC = () => {
  const {
    elements,
    addElement,
    updateElement,
    updateElementPosition,
    updateElementStyle,
    deleteElement,
  } = useInsertText();

  return (
    <div className="relative w-[90vw] h-[90vh] bg-gray-100">

      {elements.map((element) => (
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
          onContentChange={(id, content) => updateElement(id, content)}
          onPositionChange={(id, x, y, rotation) => updateElementPosition(id, x, y, rotation)}
          onStyleChange={(id, newStyle) => updateElementStyle(id, newStyle)}
          onDelete={() => deleteElement(element.id)}
        />
      ))}

      {/* Button to add new element */}
      <button
        className="absolute bottom-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={addElement}
      >
        Add Element
      </button>
    </div>
  );
};

export default InteractExample;
