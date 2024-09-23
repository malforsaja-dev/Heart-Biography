import { useState } from 'react';

// Define the shape of an element
type ElementProps = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  content: string;
};

export const useInsertText = () => {
  const [elements, setElements] = useState<ElementProps[]>([]);
  const [nextId, setNextId] = useState(1);

  // Add a new element
  const addElement = () => {
    const newElement: ElementProps = {
      id: nextId,
      x: nextId * 10, // Example initial x position
      y: nextId * 10, // Example initial y position
      rotation: 0,
      content: `<p>Element ${nextId} Content</p>`,
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  // Update an existing element's content
  const updateElement = (id: number, updatedContent: string) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, content: updatedContent } : el
      )
    );
  };

  // Update an existing element's position or rotation
  const updateElementPosition = (id: number, x: number, y: number, rotation: number) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, x, y, rotation } : el
      )
    );
  };

  // Delete an element
  const deleteElement = (id: number) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  return {
    elements,
    addElement,
    updateElement,
    updateElementPosition,
    deleteElement,
  };
};
