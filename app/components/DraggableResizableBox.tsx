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
  const initialPosition = { x: 100, y: 100 }; // Adjust initial position as needed
  const initialSize = { width: parseInt(defaultWidth), height: parseInt(defaultHeight) };
  
  const { position, startDragging, isDragging } = useDrag(initialPosition);
  const { size, startResizing, isResizing } = useResize(initialSize, position);

  // Prevent dragging when resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isResizing) {
      startDragging(e);
    }
  };

  return (
    <div
      className="absolute border border-blue-500 bg-white"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isResizing ? 'nwse-resize' : 'move', // Change cursor based on action
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {React.isValidElement(content) && content.type === Image ? (
          <Image
            src={(content.props as any).src}
            alt={(content.props as any).alt}
            layout="fill"
            objectFit="contain"
          />
        ) : (
          content
        )}
      </div>
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 cursor-se-resize z-10"
        onMouseDown={(e) => {
          e.stopPropagation(); // Prevent triggering drag
          startResizing(e, 'bottom-right');
        }}
      />
      {/* Add similar divs for other corners/sides if needed */}
    </div>
  );
};

export default DraggableResizableBox;
