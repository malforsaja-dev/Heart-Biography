import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useInsertText from '@/hooks/useInsertText';

// Dynamically import QuillEditor without SSR
const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false });

interface InteractiveElementProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  content: string;
  onContentChange: (content: string, id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number | null) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({
  id,
  x,
  y,
  rotation,
  content,
  onContentChange,
  onDelete,
  onEdit,
  isDropdownOpen,
  toggleDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the custom hook for interaction and state management
  const {
    currentContent,
    setCurrentContent,
    activeModal,
    bgColor,
    borderSize,
    borderColor,
    isBgTransparent,
    isBorderTransparent,
    handleAccept,
    handleDecline,
    handleModalState,
    handleBgColorChange,
    handleBorderSizeChange,
    handleBorderColorChange,
    toggleBgTransparency,
    toggleBorderTransparency,
    isEditMode,
  } = useInsertText({
    id,
    initialContent: content,
    onContentChange,
    onEdit,
  });

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isDropdownOpen) toggleDropdown(); // Close dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, toggleDropdown]);

  return (
    <div
      id={`element-${id}`}
      className={`absolute ${isBgTransparent ? 'bg-transparent' : ''} ${isBorderTransparent ? 'border-transparent' : ''}`}
      style={{
        width: '200px',
        height: '200px',
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        backgroundColor: isBgTransparent ? 'transparent' : bgColor,
        borderColor: isBorderTransparent ? 'transparent' : borderColor,
        borderWidth: `${borderSize}px`,
        borderStyle: 'solid',
        cursor: isEditMode ? 'default' : 'move',
        zIndex: 10,
      }}
      data-x={x}
      data-y={y}
      data-rotation={rotation}
    >
      <div className="relative w-full h-full">
        {!isEditMode && ( // Hide the three dots when any modal is active
          <div className="absolute top-1 right-1">
            <div ref={dropdownRef} className="dropdown relative">
              <button className="text-gray-700 hover:text-gray-900" onClick={toggleDropdown}>
                &#x22EE; {/* Vertical three dots icon */}
              </button>
              <div
                className={`${
                  isDropdownOpen ? 'block' : 'hidden'
                } absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10`}
              >
                <button
                  className="block px-4 py-2 text-blue-600 hover:bg-blue-100 w-full text-left"
                  onClick={() => handleModalState('edit')}
                >
                  Edit
                </button>
                <button
                  className="block px-4 py-2 text-green-600 hover:bg-green-100 w-full text-left"
                  onClick={() => handleModalState('style')}
                >
                  Style Box
                </button>
                <button
                  className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                  onClick={() => onDelete(id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {activeModal === 'edit' ? (
          <>
            {/* Quill Toolbar */}
            <div
              id={`toolbar-${id}`}
              className="absolute top-[-50px] left-0 w-80 bg-gray-100 border-b flex justify-start items-center z-20"
            >
              {/* Custom Toolbar Buttons */}
              <button className="ql-bold px-2 py-1 mx-1">B</button>
              <button className="ql-italic px-2 py-1 mx-1">I</button>
              <button className="ql-underline px-2 py-1 mx-1">U</button>
              <select className="ql-size mx-1" defaultValue="">
                <option value="small">Small</option>
                <option value="">Normal</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
              </select>
              <select className="ql-align mx-1"></select>
              <select className="ql-color mx-1"></select>
              <select className="ql-background mx-1"></select>
            </div>
            <div className="w-full h-full p-2">
              <QuillEditor
                content={currentContent}
                id={id}
                onContentChange={(updatedContent) => setCurrentContent(updatedContent)}
                toolbarId={`toolbar-${id}`}
              />
            </div>
            {/* Accept and Decline Buttons */}
            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              <button onClick={handleAccept}>✅</button>
              <button onClick={handleDecline}>❌</button>
            </div>
          </>
        ) : (
          <div className="ql-editor p-2 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
        )}

        {/* Style Modal */}
        {activeModal === 'style' && (
          <div className="absolute bottom-[-180px] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80">
            <h3 className="text-lg font-bold mb-4 text-center">Style Box</h3>
            <div className="mb-4 flex items-center justify-between">
              <label className="font-semibold">Background:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleBgColorChange(e.target.value)}
                className="border p-1"
                disabled={isBgTransparent}
              />
              <label className="flex items-center ml-2">
                <input
                  type="checkbox"
                  checked={isBgTransparent}
                  onChange={toggleBgTransparency}
                  className="mr-1"
                />
                Transparent
              </label>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="font-semibold">Border Size:</label>
              <input
                type="number"
                value={borderSize}
                onChange={(e) => handleBorderSizeChange(Number(e.target.value))}
                className="border p-1 w-16"
                min={0}
                max={10}
                disabled={isBorderTransparent}
              />
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="font-semibold">Border Color:</label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="border p-1"
                disabled={isBorderTransparent}
              />
              <label className="flex items-center ml-2">
                <input
                  type="checkbox"
                  checked={isBorderTransparent}
                  onChange={toggleBorderTransparency}
                  className="mr-1"
                />
                Transparent
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleModalState('none')}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveElement;
