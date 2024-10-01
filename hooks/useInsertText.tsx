import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { deleteText, savePageData } from '@/utils/useSupabase';
import { usePathname } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
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

const PageName: Record<string, "LpWelle" | "Fotobook" | "WorkBench"> = {
  lebensplan: "LpWelle",
  fotobook: "Fotobook",
  workbench: "WorkBench",
}

export const useInsertText = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data, updatePageData } = useUserData();
  const [diagramIndex, setDiagramIndex] = useState(0);
  const [elements, setElements] = useState<Element[]>([]);

  const pagePath = pathname.split("/")[1];
  const currentPage = PageName[pagePath];

  const pageData = useMemo(() => data[currentPage] || {}, [data[currentPage]]);

  const onSavePageData = async (updatedElements: Element[]) => {
    updatePageData(currentPage, { ...pageData, [`diagram${diagramIndex + 1}`]: updatedElements });
    console.log('Updated LpWelleData in context in handleSave:', { ...pageData, [`diagram${diagramIndex + 1}`]: updatedElements });
  
    // Save to Supabase
    await savePageData(user?.id || '', currentPage, { ...pageData, [`diagram${diagramIndex + 1}`]: updatedElements });
    console.log('Data saved to Supabase in handleSave');
  }

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
  const updateElementPosition = (id: string, newX: number, newY: number, newRotation: number) => {
    const changedElements = elements.map((el) => 
      (el.id === id ? { ...el, x: newX ?? el.x, y: newY ?? el.y, rotation: newRotation ?? el.rotation } : el)
    );
    setElements(changedElements);
    onSavePageData(changedElements);
  };

  // Function to update the style of an element by id
  const updateElementStyle = useCallback((id: string, newStyle: any) => {
    const changedElements = elements.map((el) => 
      el.id === id ? { ...el, size: { width: newStyle.width, height: newStyle.height }, style: { ...el.style, ...newStyle } } : el
    );
    setElements(changedElements);
    onSavePageData(changedElements);
  }, [elements, setElements]);
  
  useEffect(() => {
    const currentDiagram = `diagram${diagramIndex + 1}`;
    console.log('Fetching Elements for Diagram:', currentDiagram, 'Data:', pageData[currentDiagram]);
    if (pageData[currentDiagram]) {
      setElements(pageData[currentDiagram]);
    } else {
      setElements([]);
    }
  }, [pageData, diagramIndex, setElements]);

  // Function to delete an element by id
  const deleteElement = (id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    deleteText(user?.id || '', currentPage, diagramIndex, `text${id}`);
  };

  return {
    elements,
    diagramIndex,
    setElements,
    addElement,
    updateElement,
    setDiagramIndex,
    updateElementPosition,
    updateElementStyle,
    onSavePageData,
    deleteElement,
  };
};
