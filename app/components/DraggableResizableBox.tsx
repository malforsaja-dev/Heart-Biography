import React, { useState } from 'react';
import { useDrag } from '@/app/hooks/useDrag';
import { useResize } from '@/app/hooks/useResize';
import Image from 'next/image';

interface DraggableResizableBoxProps {
  id: number;
  content: string | React.ReactNode;
  defaultWidth: string;
  defaultHeight: string;
  onRemove: (id: number) => void;
}

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({ id, content, defaultWidth, defaultHeight, onRemove }) => {
  const initialPosition = { x: 100, y: 100 };
  const initialSize = { width: parseInt(defaultWidth), height: parseInt(defaultHeight) };
  
  const { position, startDragging } = useDrag(initialPosition);
  const { size, startResizing, isResizing } = useResize(initialSize, position);

  const [text, setText] = useState(typeof content === 'string' ? content : '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(text);

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      startDragging(e);
    }
  };


  const toggleEditMode = () => {
    setIsEditing(true);
    setTempText(text);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempText(text);
  };

  const handleConfirmEdit = () => {
    setText(tempText);
    setIsEditing(false);
  };

  return (
    <div
      className="absolute border border-blue-500 bg-white group cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isResizing ? 'nwse-resize' : 'move',
      }}
      onMouseDown={!isEditing ? startDragging : undefined}

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
          isEditing ? (
            <>
              <textarea
                className="w-full h-full border-none focus:outline-none resize-none bg-transparent text-center whitespace-pre-wrap"
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute -bottom-10 left-1/3 flex space-x-1 p-1 z-20">
                <button
                  className="text-2xl  px-2 py-1"
                  onClick={handleConfirmEdit}
                >
                  ✅
                </button>
                <button
                  className="text-2xl  px-2 py-1"
                  onClick={handleCancelEdit}
                >
                  ❌
                </button>
              </div>
            </>
          ) : (
            <div onMouseDown={handleTextClick} className="whitespace-pre-wrap">{text}</div>
          )
        )}
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-700 cursor-se-resize z-10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"
          onMouseDown={(e) => {
            e.stopPropagation();
            startResizing(e, 'bottom-right');
          }}
        />
      </div>
      <div
        className="absolute top-0 right-0 w-5 h-5 bg-red-700 text-white flex justify-center items-center text-xs cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(id)}
      >
        ✕
      </div>
      <div
        className="absolute bottom-0 right-0 w-5 h-5 bg-blue-700 cursor-se-resize z-10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"
        onMouseDown={(e) => {
          e.stopPropagation();
          startResizing(e, 'bottom-right');
        }}
      />
      {typeof content === 'string' && (
        <div
          className="absolute bottom-0 left-0 w-5 h-5 bg-yellow-500 text-white flex justify-center items-center text-xs cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            toggleEditMode();
          }}
          style={{ transform: 'scaleX(-1)' }}
        >
          ✎
        </div>
      )}

    </div>
  );
};

export default DraggableResizableBox;
