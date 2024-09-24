import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import DropdownMenu from './DropdownMenu';
import StyleBox from './StyleBox';
import TextEditor from './TextEditor'; // Import TextEditor component

interface InsertTextProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  content: string;
  onContentChange: (content: string, id: number) => void;
  onPositionChange: (id: number, x: number, y: number, rotation: number) => void;
  onDelete: (id: number) => void;
  className?: string;
}

const InsertText: React.FC<InsertTextProps> = ({
  id,
  x,
  y,
  rotation,
  content,
  onContentChange,
  onPositionChange,
  onDelete,
  className,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'style' | 'text' | 'rotate'>('none');
  const [backgroundColor, setBackgroundColor] = useState('#63b3ed');
  const [borderColor, setBorderColor] = useState('#4299e1');
  const [borderSize, setBorderSize] = useState(2);
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [isBorderTransparent, setIsBorderTransparent] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [width, setWidth] = useState<number>(256); // Initial width
  const [height, setHeight] = useState<number>(256); // Initial height
  
  const elementRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.setAttribute('data-x', x.toString());
      elementRef.current.setAttribute('data-y', y.toString());
      elementRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      elementRef.current.style.width = `${width}px`;
      elementRef.current.style.height = `${height}px`;
    }
  }, [x, y, rotation, id, width, height]);

  useEffect(() => {
    // Re-initialize interact.js only if not already initialized
    if (elementRef.current && !interactableRef.current) {
      interactableRef.current = interact(elementRef.current)
        .draggable({
          inertia: true,
          listeners: {
            move(event) {
              const target = event.target;
              const startX = parseFloat(target.getAttribute('data-x') || '0');
              const startY = parseFloat(target.getAttribute('data-y') || '0');
              const newX = startX + event.dx;
              const newY = startY + event.dy;
              target.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation}deg)`;
              target.setAttribute('data-x', newX.toString());
              target.setAttribute('data-y', newY.toString());
            },
            end(event) {
              const target = event.target;
              const newX = parseFloat(target.getAttribute('data-x') || '0');
              const newY = parseFloat(target.getAttribute('data-y') || '0');
              onPositionChange(id, newX, newY, rotation);
            },
          },
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: true,
          listeners: {
            move(event) {
              const target = event.target;
              const newWidth = event.rect.width;
              const newHeight = event.rect.height;
              const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.deltaRect.left;
              const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.deltaRect.top;

              // Update styles
              target.style.width = `${newWidth}px`;
              target.style.height = `${newHeight}px`;
              target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());

              // Update state with new width and height
              setWidth(newWidth);
              setHeight(newHeight);
            },
            end(event) {
              const target = event.target;
              const newX = parseFloat(target.getAttribute('data-x') || '0');
              const newY = parseFloat(target.getAttribute('data-y') || '0');
              onPositionChange(id, newX, newY, rotation);
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
        interactableRef.current.unset(); // Clean up interact.js instance on unmount
        interactableRef.current = null;
      }
    };
  }, [rotation, id, onPositionChange]);

  useEffect(() => {
    // Enable or disable interact.js based on editing mode
    if (interactableRef.current) {
      interactableRef.current.draggable({ enabled: !isEditing });
      interactableRef.current.resizable({ enabled: !isEditing });
    }
  }, [isEditing]);

  // This useEffect ensures interact.js state is retained during content change
  useEffect(() => {
    if (interactableRef.current) {
      // Re-enable interact.js after content changes
      interactableRef.current.draggable({ enabled: !isEditing });
      interactableRef.current.resizable({ enabled: !isEditing });
    }
  }, [content, isEditing]); // Listen to content changes but retain interact state

  const toggleModal = (modalType: 'style' | 'text' | 'rotate') => {
    if (modalType === 'text') {
      setIsEditing(!isEditing); // Toggle edit mode
    }
    setActiveModal(activeModal === modalType ? 'none' : modalType);
    setIsDropdownOpen(false);
  };

  const handleRotationChange = (newRotation: number) => {
    const target = elementRef.current;
    if (target) {
      const x = parseFloat(target.getAttribute('data-x') || '0') || 0;
      const y = parseFloat(target.getAttribute('data-y') || '0') || 0;
      target.style.transform = `translate(${x}px, ${y}px) rotate(${newRotation}deg)`;
    }
    onPositionChange(id, x, y, newRotation);
  };

  return (
    <div
      ref={elementRef}
      className={`absolute w-64 h-64 p-4 rounded-md border ${className}`}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        backgroundColor: isBgTransparent ? 'transparent' : backgroundColor,
        borderColor: isBorderTransparent ? 'transparent' : borderColor,
        borderWidth: `${borderSize}px`,
        zIndex: id,
        width: `${width}px`, // Maintain the element's current width
        height: `${height}px`, // Maintain the element's current height
        cursor: isEditing ? 'text' : 'move', // Use 'move' cursor for drag
        userSelect: isEditing ? 'text' : 'unset',
      }}
      data-x={x}
      data-y={y}
      key={`${id}-${width}-${height}`} // Re-render based on size and content changes
    >
      {/* Display content with Quill formatting only if not editing */}
      {!isEditing && (
        <div
          className="w-full h-full overflow-auto ql-editor"
          style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
          dangerouslySetInnerHTML={{ __html: content }} // ql-editor class for default Quill styling
        />
      )}

      {/* Dropdown Button */}
      <div className="absolute top-1 right-1">
        <button className="bg-gray-300 px-2 rounded-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          &#x22EE;
        </button>
        {isDropdownOpen && (
          <DropdownMenu
            onEditText={() => toggleModal('text')}
            onEditStyle={() => toggleModal('style')}
            onRotate={() => toggleModal('rotate')}
            onDelete={() => onDelete(id)}
          />
        )}
      </div>


      {/* Conditional Modals */}
      {activeModal === 'style' && (
        <StyleBox
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          borderSize={borderSize}
          isBgTransparent={isBgTransparent}
          isBorderTransparent={isBorderTransparent}
          onBgColorChange={setBackgroundColor}
          onBorderColorChange={setBorderColor}
          onBorderSizeChange={setBorderSize}
          onBgTransparencyToggle={() => setIsBgTransparent(!isBgTransparent)}
          onBorderTransparencyToggle={() => setIsBorderTransparent(!isBorderTransparent)}
          onClose={() => setActiveModal('none')}
        />
      )}
      {activeModal === 'text' && (
        <TextEditor
          id={id}
          content={content}
          onContentChange={onContentChange}
          onClose={() => {
            setActiveModal('none');
            setIsEditing(false); // Exit edit mode on close
          }}
        />
      )}
      {activeModal === 'rotate' && (
        <div className="absolute bottom-[-120px] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80">
          <h3 className="text-lg font-bold mb-4 text-center">Rotate Box</h3>
          <div className="flex items-center justify-between">
            <label className="font-semibold">Rotation (°):</label>
            <input
              type="number"
              value={rotation}
              onChange={(e) => handleRotationChange(Number(e.target.value))}
              className="border p-1 w-16"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setActiveModal('none')}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertText;
