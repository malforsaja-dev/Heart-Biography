import React from 'react';
import { useDrag } from '@/app/hooks/useDrag';
import { useResize } from '@/app/hooks/useResize';
import Image from 'next/image';

interface DraggableResizableBoxProps {
  content: React.ReactNode;
  defaultWidth: string;
  defaultHeight: string;
}

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({ content, defaultWidth, defaultHeight }) => {
  const initialPosition = { x: 100, y: 100 };
  const initialSize = { width: parseInt(defaultWidth), height: parseInt(defaultHeight) };
  
  const { position, startDragging } = useDrag(initialPosition);
  const { size, startResizing } = useResize(initialSize, position);

  return (
    <div
      className="absolute border border-blue-500 bg-white group cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={startDragging}
    >
      <div className="w-full h-full flex justify-center items-center relative">
        {React.isValidElement(content) && content.type === Image ? (
          <Image
            src={(content.props as any).src}
            alt={(content.props as any).alt}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          content
        )}
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-700 cursor-se-resize z-10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"
          onMouseDown={(e) => {
            e.stopPropagation();
            startResizing(e, 'bottom-right');
          }}
        />
      </div>
    </div>
  );
};

export default DraggableResizableBox;
