
"use client"

import React, { useState } from 'react';
import InsertText from '@/components/insertText/InsertText';

const InteractExample: React.FC = () => {
  // State for managing elements directly in the component
  const [elements, setElements] = useState<{ id: number; x: number; y: number; rotation: number; content: string }[]>([]);
  const [nextId, setNextId] = useState(1);

  // Add a new element directly in the component
  const addElement = () => {
    const newElement = {
      id: nextId,
      x: nextId * 10, // Example initial x position
      y: nextId * 10, // Example initial y position
      rotation: 0,
      content: `<p>Element ${nextId} Content</p>`,
    };
    setElements((prevElements) => [...prevElements, newElement]);
    setNextId((prevId) => prevId + 1);
  };

  // Update an existing element's content
  const updateElement = (id: number, updatedContent: string) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, content: updatedContent } : el))
    );
  };

  // Update an existing element's position or rotation
  const updateElementPosition = (id: number, x: number, y: number, rotation: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, x, y, rotation } : el))
    );
  };

  // Delete an element directly in the component
  const deleteElement = (id: number) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  return (
    <div className="relative w-[90vw] h-[90vh] bg-gray-100">
      {/* Render each element */}
      {elements.map((element) => (
        <InsertText
          key={element.id}
          id={element.id}
          x={element.x}
          y={element.y}
          rotation={element.rotation}
          content={element.content}
          onContentChange={(content) => updateElement(element.id, content)}
          onPositionChange={(id, x, y, rotation) => updateElementPosition(id, x, y, rotation)}
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
