import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';

type ElementData = {
  id: number;
  content: string | React.ReactNode;
  defaultWidth: string;
  defaultHeight: string;
  x: number;
  y: number;
  type: 'text' | 'image';
  src?: string;
  pageNumber: number;
};

export const useWorkbenchElements = () => {
  const [elementsFront, setElementsFront] = useState<ElementData[]>([]);
  const [elementsBack, setElementsBack] = useState<ElementData[]>([]);
  const [isFrontSide, setIsFrontSide] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('fotobook')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching elements:', error);
      } else if (data && data.length) {
        const pageData = data[0];
        setElementsFront(pageData?.elements?.front || []);
        setElementsBack(pageData?.elements?.back || []);
      }
    };

    fetchData();
  }, [user]);

  const saveToDatabase = async () => {
    if (!user) return;

    const dataToSave = {
      user_id: user.id,
      page_number: 1,
      side: isFrontSide ? 'front' : 'back',
      elements: {
        front: elementsFront,
        back: elementsBack,
      },
    };

    const { error } = await supabase.from('fotobook').upsert([dataToSave]);
    if (error) {
      console.error('Error saving elements:', error);
    }
  };

  const addTextElement = (currentPage: number) => {
    const newElement: ElementData = {
      id: Date.now(),
      content: 'New Text',
      defaultWidth: '200px',
      defaultHeight: '50px',
      x: 100,
      y: 100,
      type: 'text',
      pageNumber: currentPage,
    };
  
    if (isFrontSide) {
      setElementsFront((prevElements) => [...prevElements, newElement]);
    } else {
      setElementsBack((prevElements) => [...prevElements, newElement]);
    }
  };


  const addImageElement = (url: string, currentPage: number) => {
    const newElement: ElementData = {
      id: Date.now(),
      content: url,
      defaultWidth: '100px',
      defaultHeight: '100px',
      x: 100,
      y: 100,
      type: 'image',
      src: url,
      pageNumber: currentPage,
    };
    if (isFrontSide) {
      setElementsFront((prevElements) => [...prevElements, newElement]);
    } else {
      setElementsBack((prevElements) => [...prevElements, newElement]);
    }
  };

  const updateElement = (id: number, data: { x?: number; y?: number; width?: number; height?: number }) => {
    const updateFunc = (elements: ElementData[], setElements: React.Dispatch<React.SetStateAction<ElementData[]>>) => {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === id ? { ...element, ...data } : element
        )
      );
    };
  
    if (isFrontSide) {
      updateFunc(elementsFront, setElementsFront);
    } else {
      updateFunc(elementsBack, setElementsBack);
    }
  };

  const removeElement = async (id: number) => {
    const elementToRemove = isFrontSide
      ? elementsFront.find((el) => el.id === id)
      : elementsBack.find((el) => el.id === id);

    if (elementToRemove?.type === 'image' && elementToRemove?.src) {
      const filePath = elementToRemove.src.split(`${user?.id}/`)[1];
      const { error } = await supabase.storage.from('seiten-images').remove([`${user?.id}/${filePath}`]);
      if (error) {
        console.error('Error deleting image:', error);
      }
    }

    if (isFrontSide) {
      setElementsFront((prevElements) => prevElements.filter((element) => element.id !== id));
    } else {
      setElementsBack((prevElements) => prevElements.filter((element) => element.id !== id));
    }
  };

  const flipPage = (currentPage: number) => {
    if (currentPage === 0) return;
    setIsFrontSide((prev) => !prev); 
  };

  return {
    elementsFront,
    elementsBack,
    isFrontSide,
    setIsFrontSide,
    addTextElement,
    addImageElement,
    updateElement,
    removeElement,
    saveToDatabase,
    flipPage,
  };
};
