import { useState, useCallback, useEffect } from 'react';
// Import a unique ID generator
import { v4 as uuidv4 } from 'uuid';

export interface Element {
  id: string;
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

const defaultElementStructure = {
  x: 250,
  y: 250,
  rotation: 0,
  content: 'New Text',
  size: { width: '200px', height: '100px' },
  style: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderSize: 2,
    isBgTransparent: true,
    isBorderTransparent: false,
  },
};

export const useInsertText = () => {
  const [elements, setElements] = useState<Element[]>([]);

  // Function to add a new element
  const addElement = () => {
    const newElement: Element = {
      ...defaultElementStructure,
      id: uuidv4(), // Generate unique ID for each new element
    };

    setElements((prevElements) => [...prevElements, newElement]);
  };

  // Function to update an existing element by id
  const updateElement = (id: string, updatedContent: string, newSize?: { width: string; height: string }, rotation?: number) => {
    console.log('updateElement called with:', { id, updatedContent, newSize, rotation });
    setElements((prevElements) => {
      return prevElements.map((el) => 
        el.id === id ? { ...el, content: updatedContent, size: newSize ?? el.size, rotation: rotation ?? el.rotation } : el
      );
    });
    console.log('Elements state after updateElement:', elements); // Check the state after update
  };
  

  // Function to update the position of an element by id
  const updateElementPosition = (id: string, x: number, y: number, rotation: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, x, y, rotation } : el))
    );
  };

  // Function to update the style of an element by id
  const updateElementStyle = useCallback((id: string, newStyle: any) => {
    setElements((prevElements) => {
      const updatedElements = prevElements.map((el) =>
        el.id === id ? { ...el, size: { width: `${newStyle.width}px`, height: `${newStyle.height}px` }, style: { ...el.style, ...newStyle } } : el
      );
      console.log('Updated Elements in useInsertText after style change:', updatedElements);
      return updatedElements;
    });
  }, [setElements]);
  

  useEffect(() => {
    console.log('Elements state updated:', elements);
  }, [elements]);

  // Function to delete an element by id
  const deleteElement = (id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  return {
    elements,
    setElements,
    addElement,
    updateElement,
    updateElementPosition,
    updateElementStyle,
    deleteElement,
  };
};
