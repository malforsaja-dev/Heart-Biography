import { useState, useRef, useEffect } from 'react';
import useClickOutside from './useClickOutside'; // Adjust the path as needed

export const useEditableText = (initialText: string, maxLength?: number) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleEditMode = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e) e.stopPropagation();
    setIsEditing(!isEditing);
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      setTempText(e.target.value);
    }
  };

  useClickOutside(containerRef, handleCancelEdit);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tempText]);

  const renderEditor = () => (
    <div 
      ref={containerRef} 
      className={`relative z-10 ${isEditing && maxLength ? 'border border-blue-500' : ''}`}
    >
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-4 p-1">
        <button
          className="text-2xl px-2 py-1"
          onClick={handleConfirmEdit}
        >
          ✅
        </button>
        <button
          className="text-2xl px-2 py-1"
          onClick={handleCancelEdit}
        >
          ❌
        </button>
        {maxLength && (
          <div className="text-sm">
            {tempText.length}/{maxLength}
          </div>
        )}
      </div>
      <textarea
        ref={textareaRef}
        className="w-full max-w-[800px] border-none focus:outline-none resize-none bg-transparent text-center whitespace-pre-wrap overflow-hidden"
        value={tempText}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        placeholder="Type here..."
      />
    </div>
  );

  return {
    text,
    isEditing,
    toggleEditMode,
    renderEditor,
  };
};
