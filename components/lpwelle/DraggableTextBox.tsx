import { useDrag } from '@/hooks/useDrag';
import { useResize } from '@/hooks/useResize';
import { useEditableText } from '@/hooks/useEditableText';
import React from 'react';

interface DraggableTextBoxProps {
  id: number;
  content: string;
  defaultWidth: string;
  defaultHeight: string;
  initialPosition: { x: number; y: number };
  onRemove: (id: number) => void;
  onSave: (newContent: string) => void;
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  id,
  content,
  defaultWidth,
  defaultHeight,
  initialPosition,
  onRemove,
  onSave,
}) => {
  const { position, startDragging } = useDrag(initialPosition);
  const { size, startResizing } = useResize({ width: parseInt(defaultWidth), height: parseInt(defaultHeight) }, position);
  const { text, isEditing, toggleEditMode, renderEditor } = useEditableText({
    initialText: content,
    onSave: async (newText: string) => {
      onSave(newText);
    },
  });

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      startDragging(e);
    }
  };

  return (
    <div
      className="absolute border-2 border-transparent hover:border-blue-500 group cursor-move z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={!isEditing ? startDragging : undefined}
    >
      <div className="w-full h-full flex justify-center items-center relative z-10">
        {isEditing ? renderEditor() : (
          <div onMouseDown={handleTextClick} className="whitespace-pre-wrap">{text}</div>
        )}
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
    </div>
  );
};

export default DraggableTextBox;
