"use client";

import Buttons from '@/components/fotobook/Buttons';
import Pagination from '@/components/fotobook/Pagination';
import Paper from '@/components/fotobook/Paper';
import { useWorkbenchElements } from '@/hooks/useWorkbenchElements';
import useDiagramDates from '@/hooks/useDiagramDates';
import { useState } from 'react';

const WorkBench = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { dates } = useDiagramDates((currentPage - 4) / 2);
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  const {
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
  } = useWorkbenchElements();

  const maxPapers = 24;

  const handlePaperNavigation = (index: number) => {
    if (index === 0) {
      setCurrentPage(0);
    } else if (index === 1) {
      setCurrentPage(2);
    } else {
      setCurrentPage((index - 1) * 2 + 2); // Other papers
    }
    setIsFrontSide(true); // Always show front side first when navigating
  };

  return (
    <div className='pb-20'>
      <Buttons
        currentPage={currentPage}
        addTextElement={addTextElement}
        flipPage={flipPage}
        saveToDatabase={saveToDatabase}
        addImageElement={addImageElement}
      />

      <Pagination maxPapers={maxPapers} currentPage={currentPage} handlePaperNavigation={handlePaperNavigation} />

      <div className="relative w-[210mm] h-[297mm] mx-auto pb-20" style={{ perspective: '1000px' }}>
        <Paper
          currentPage={currentPage}
          isFrontSide={isFrontSide}
          startDate={startDate}
          endDate={endDate}
          elementsFront={elementsFront}
          elementsBack={elementsBack}
          updateElement={updateElement}
          removeElement={removeElement}
        />
      </div>
    </div>
  );
};

export default WorkBench;
