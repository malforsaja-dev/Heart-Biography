import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import DropdownMenu from './DropdownMenu';
import StyleBox from './StyleBox';
import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

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
  const [isRotating, setIsRotating] = useState(false); // Track rotation mode
  const [width, setWidth] = useState<number>(256); // Initial width
  const [height, setHeight] = useState<number>(256); // Initial height
  const [modalPosition, setModalPosition] = useState<{ left: number; top: number }>({ left: x + 100, top: y });
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({ left: x, top: y });

  const elementRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);

  useEffect(() => {
    if (elementRef.current && !interactableRef.current) {
      interactableRef.current = interact(elementRef.current)
        .draggable({
          inertia: true,
          listeners: {
            move(event) {
              if (isRotating) return; // Disable drag if rotating
              const target = event.target;
              const startX = parseFloat(target.getAttribute('data-x') || '0');
              const startY = parseFloat(target.getAttribute('data-y') || '0');
              const newX = startX + event.dx;
              const newY = startY + event.dy;
  
              target.style.left = `${newX}px`;
              target.style.top = `${newY}px`;
  
              target.setAttribute('data-x', newX.toString());
              target.setAttribute('data-y', newY.toString());

              // Update modal and dropdown positions
              setModalPosition({ left: newX + 50, top: newY }); // Offset the modal position from element
              setDropdownPosition({ left: newX, top: newY });
            },
            end(event) {
              if (isRotating) return; // No action if rotating
              const target = event.target;
              const newX = parseFloat(target.getAttribute('data-x') || '0');
              const newY = parseFloat(target.getAttribute('data-y') || '0');
              onPositionChange(id, newX, newY, rotation);
            },
          },
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
              if (isRotating) return; // Disable resize if rotating
              const target = event.target;
              const newWidth = event.rect.width;
              const newHeight = event.rect.height;

              let newLeft = parseFloat(target.getAttribute('data-x') || '0');
              let newTop = parseFloat(target.getAttribute('data-y') || '0');

              if (event.edges.left) {
                newLeft += event.deltaRect.left;
              }
              if (event.edges.top) {
                newTop += event.deltaRect.top;
              }

              target.style.width = `${newWidth}px`;
              target.style.height = `${newHeight}px`;
              target.style.left = `${newLeft}px`;
              target.style.top = `${newTop}px`;

              target.setAttribute('data-x', newLeft.toString());
              target.setAttribute('data-y', newTop.toString());

              setWidth(newWidth);
              setHeight(newHeight);

              // Update modal and dropdown positions
              setModalPosition({ left: newLeft + 50, top: newTop });
              setDropdownPosition({ left: newLeft, top: newTop });
            },
            end(event) {
              if (isRotating) return; // No action if rotating
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
  }, [rotation, id, onPositionChange, isRotating]);

  useEffect(() => {
    if (interactableRef.current) {
      interactableRef.current.draggable({ enabled: !isEditing && !isRotating });
      interactableRef.current.resizable({ enabled: !isEditing && !isRotating });
    }
  }, [isEditing, isRotating]);

  const toggleModal = (modalType: 'style' | 'text' | 'rotate') => {
    if (modalType === 'text') {
      setIsEditing(!isEditing); // Toggle edit mode
    }
    if (modalType === 'rotate') {
      setIsRotating(!isRotating); // Toggle rotation mode
    }
    setActiveModal(activeModal === modalType ? 'none' : modalType);
    setIsDropdownOpen(false);
  };

  const handleRotationChange = (newRotation: number) => {
    const target = elementRef.current;
    if (target) {
      // Apply rotation transform
      target.style.transform = `rotate(${newRotation}deg)`;
      onPositionChange(id, parseFloat(target.getAttribute('data-x') || '0'), parseFloat(target.getAttribute('data-y') || '0'), newRotation);
    }
  };

  return (
    <div className="relative"> {/* Parent container */}
      <div
        ref={elementRef}
        className={`absolute w-64 h-64 p-4 rounded-md border ${className}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: isBgTransparent ? 'transparent' : backgroundColor,
          borderColor: isBorderTransparent ? 'transparent' : borderColor,
          borderWidth: `${borderSize}px`,
          zIndex: id,
          width: `${width}px`,
          height: `${height}px`,
          cursor: isEditing ? 'text' : 'move',
          userSelect: isEditing ? 'text' : 'unset',
          transform: `rotate(${rotation}deg)`, // Apply rotation directly in style
        }}
        data-x={x}
        data-y={y}
      >
        {!isEditing && (
          <div
            className="w-full h-full overflow-auto ql-editor"
            style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Empty placeholder for dropdown positioning */}
        <div className="absolute top-1 right-1 z-10">
          <button className="bg-gray-300 px-2 rounded-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            &#x22EE;
          </button>
        </div>

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
      </div>

      {/* Fixed-position dropdown outside the element's rotation */}
      {isDropdownOpen && (
        <div
          className="absolute bg-white border border-gray-300 shadow-md rounded-lg z-10"
          style={{
            left: `${dropdownPosition.left + 230}px`, // Offset the dropdown position from element
            top: `${dropdownPosition.top + 10}px`, // Align it vertically with the element
            transform: 'none', // Ensure no transformation is applied
          }}
        >
          <DropdownMenu
            onEditText={() => toggleModal('text')}
            onEditStyle={() => toggleModal('style')}
            onRotate={() => toggleModal('rotate')}
            onDelete={() => onDelete(id)}
          />
        </div>
      )}

      {activeModal === 'rotate' && (
        <div
          className="absolute bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80"
          style={{
            left: `${modalPosition.left}px`,
            top: `${modalPosition.top}px`,
            transform: 'none',
          }}
        >
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
