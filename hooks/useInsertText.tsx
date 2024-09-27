import { useState, useCallback } from 'react';

export interface Element {
  id: number;
  x: number;
  y: number;
  rotation: number;
  content: string;
  size: { width: string; height: string };
  style: {
    backgroundColor: string;
    borderColor: string;
    borderSize: number;
    isBgTransparent: boolean;
    isBorderTransparent: boolean;
  };
}

export const useInsertText = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [nextId, setNextId] = useState(1);

  const addElement = () => {
    const newElement: Element = {
      id: nextId,
      x: nextId * 10,
      y: nextId * 10,
      rotation: 0,
      content: `<p>Element ${nextId} Content</p>`,
      size: { width: '250px', height: '150px' },
      style: {
        backgroundColor: '#63b3ed',
        borderColor: '#4299e1',
        borderSize: 2,
        isBgTransparent: false,
        isBorderTransparent: false,
      }
    };
    setElements((prevElements) => [...prevElements, newElement]);
    setNextId((prevId) => prevId + 1);
  };

  const updateElement = (id: number, updatedContent: string, newSize?: { width: string; height: string }, rotation?: number) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, content: updatedContent, size: newSize ?? el.size, rotation: rotation ?? el.rotation } : el
      )
    );
  };

  const updateElementPosition = (id: number, x: number, y: number, rotation: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, x, y, rotation } : el))
    );
  };

  const updateElementStyle = useCallback((id: number, newStyle: any) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, style: { ...el.style, ...newStyle } } : el
      )
    );
  }, []);

    // Reset elements for a new diagram
    const resetElements = () => {
      setElements([]);
      setNextId(1);
    };

  // Delete the element
  const deleteElement = (id: number) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  return {
    elements,
    setElements,
    addElement,
    updateElement,
    updateElementPosition,
    updateElementStyle,
    resetElements,
    deleteElement,
  };
};
