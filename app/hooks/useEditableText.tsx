import { useState } from 'react';

export const useEditableText = (initialText: string) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(initialText);

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

  const renderEditor = () => (
    <>
      <textarea
        className="w-full h-full border-none focus:outline-none resize-none bg-transparent text-center whitespace-pre-wrap"
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute -bottom-10 left-1/3 flex space-x-1 p-1">
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
      </div>
    </>
  );

  return {
    text,
    isEditing,
    toggleEditMode,
    renderEditor,
  };
};
