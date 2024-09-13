import { useState, useRef, useEffect } from 'react';
import '@/app/lebensplan/style.css';

interface UseEditableTextParams {
  initialText: string;
  onSave: (text: string) => Promise<void>;
}

export const useEditableText = ({ initialText, onSave }: UseEditableTextParams) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
    setTempText(initialText);
  }, [initialText]);

  const toggleEditMode = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) e.stopPropagation();
    setIsEditing(!isEditing);
    setTempText(text);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempText(text);
  };

  const handleConfirmEdit = async () => {
    setText(tempText);
    setIsEditing(false);
    await onSave(tempText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tempText]);


  const renderEditor = () => (
    <div className="editable-text-container">
      <div className="editable-text-controls">
        <button className="confirm-btn" onClick={handleConfirmEdit}>
          ✅
        </button>
        <button className="cancel-btn" onClick={handleCancelEdit}>
          ❌
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="editable-textarea"
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
