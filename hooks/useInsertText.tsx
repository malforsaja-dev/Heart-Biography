import { useState } from 'react';

export interface Element {
  id: number;
  x: number;
  y: number;
  rotation: number;
  content: string;
}

export const useInsertText = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [nextId, setNextId] = useState(1);

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

  const updateElement = (id: number, updatedContent: string) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, content: updatedContent } : el))
    );
  };

  const updateElementPosition = (id: number, x: number, y: number, rotation: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, x, y, rotation } : el))
    );
  };

  const deleteElement = (id: number) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  return {
    elements,
    addElement,
    updateElement,
    updateElementPosition,
    deleteElement,
  };
};
