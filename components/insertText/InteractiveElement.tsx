import React, { useEffect, useState, useRef } from 'react';
import interact from 'interactjs';
import dynamic from 'next/dynamic';

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
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({
  id,
  x,
  y,
  rotation,
  content,
  onContentChange,
  onDelete,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'style' | 'text' | 'rotate'>('none');
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [backgroundColor, setBackgroundColor] = useState('#63b3ed');
  const [borderColor, setBorderColor] = useState('#4299e1');
  const [borderSize, setBorderSize] = useState(2);
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [isBorderTransparent, setIsBorderTransparent] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);

  // Initialize draggable and resizable interactions
  useEffect(() => {
    if (elementRef.current) {
      interactableRef.current = interact(elementRef.current)
        .draggable({
          inertia: true,
          listeners: {
            move(event) {
              const target = event.target;
              const x = (parseFloat(target.getAttribute('data-x') || '0')) + event.dx;
              const y = (parseFloat(target.getAttribute('data-y') || '0')) + event.dy;
              target.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;
              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());
            }
          }
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: true,
          listeners: {
            move(event) {
              const target = event.target;
              const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.deltaRect.left;
              const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.deltaRect.top;
              target.style.width = `${event.rect.width}px`;
              target.style.height = `${event.rect.height}px`;
              target.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;
              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());
            },
          },
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: 100, height: 50 },
            }),
          ],
        });
    }

    return () => {
      if (interactableRef.current) {
        interactableRef.current.unset();
      }
    };
  }, [currentRotation]);

  // Control interaction state based on edit and rotate mode
  useEffect(() => {
    if (interactableRef.current) {
      const shouldDisable = activeModal !== 'none';
      interactableRef.current.draggable({
        enabled: !shouldDisable,
      });
      interactableRef.current.resizable({
        enabled: !shouldDisable,
      });
    }
  }, [activeModal]);

  // Strictly enforce disabling during rotation
  useEffect(() => {
    if (activeModal === 'rotate' && interactableRef.current) {
      interactableRef.current.draggable({
        enabled: false,
      });
      interactableRef.current.resizable({
        enabled: false,
      });
    }
  }, [activeModal, currentRotation]);

  // Update edit mode based on modal state
  useEffect(() => {
    const isActiveEditMode = activeModal !== 'none';
    setIsEditMode(isActiveEditMode);
  }, [activeModal]);

  const toggleModal = (modalType: 'style' | 'text' | 'rotate') => {
    setActiveModal(activeModal === modalType ? 'none' : modalType);
    setIsDropdownOpen(false); // Close dropdown when modal is triggered
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleContentChange = (newContent: string) => {
    onContentChange(newContent, id);
  };

  const handleRotationChange = (newRotation: number) => {
    setCurrentRotation(newRotation);
    const target = elementRef.current;
    if (target) {
      const x = parseFloat(target.getAttribute('data-x') || '0') || 0;
      const y = parseFloat(target.getAttribute('data-y') || '0') || 0;
      target.style.transform = `translate(${x}px, ${y}px) rotate(${newRotation}deg)`;
    }
  };

  // Handle background color change
  const handleBgColorChange = (color: string) => {
    if (!isBgTransparent) {
      setBackgroundColor(color);
    }
  };

  // Handle border size change
  const handleBorderSizeChange = (size: number) => {
    setBorderSize(size);
  };

  // Handle border color change
  const handleBorderColorChange = (color: string) => {
    if (!isBorderTransparent) {
      setBorderColor(color);
    }
  };

  // Toggle background transparency
  const toggleBgTransparency = () => {
    setIsBgTransparent(!isBgTransparent);
  };

  // Toggle border transparency
  const toggleBorderTransparency = () => {
    setIsBorderTransparent(!isBorderTransparent);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={elementRef}
        className={`absolute w-64 h-64 p-4 rounded-md border ${
          isEditMode ? 'cursor-default' : 'cursor-move'
        }`}
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`,
          backgroundColor: isBgTransparent ? 'transparent' : backgroundColor,
          borderColor: isBorderTransparent ? 'transparent' : borderColor,
          borderWidth: `${borderSize}px`,
        }}
        data-x={x}
        data-y={y}
      >
        {activeModal === 'text' ? (
          <>
            {/* Quill Toolbar */}
            <div
              id={`quill-toolbar-${id}`}
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
                id={id} // Include id prop
                content={content}
                onContentChange={handleContentChange}
                toolbarId={`quill-toolbar-${id}`}
              />
            </div>
            {/* Accept and Decline Buttons */}
            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              <button onClick={() => toggleModal('text')}>✅</button>
              <button onClick={() => toggleModal('text')}>❌</button>
            </div>
          </>
        ) : activeModal === 'style' ? (
          <>
            {/* Style Modal */}
            <div className="absolute bottom-[-180px] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80">
              <h3 className="text-lg font-bold mb-4 text-center">Style Box</h3>
              <div className="mb-4 flex items-center justify-between">
                <label className="font-semibold">Background:</label>
                <input
                  type="color"
                  value={backgroundColor}
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
                  onClick={() => toggleModal('style')}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        ) : activeModal === 'rotate' ? (
          <>
            {/* Rotate Modal */}
            <div className="absolute bottom-[-120px] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80">
              <h3 className="text-lg font-bold mb-4 text-center">Rotate Box</h3>
              <div className="flex items-center justify-between">
                <label className="font-semibold">Rotation (°):</label>
                <input
                  type="number"
                  value={currentRotation}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  className="border p-1 w-16"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => toggleModal('rotate')}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="w-full h-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {/* Dropdown Menu */}
            <div className="absolute top-1 right-1">
              <button className="bg-gray-300 px-2 rounded-full" onClick={toggleDropdown}>
                &#x22EE;
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => toggleModal('text')}
                  >
                    Edit Text
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => toggleModal('style')}
                  >
                    Edit Background
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => toggleModal('rotate')}
                  >
                    Rotate
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveElement;
