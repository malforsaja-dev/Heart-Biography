import { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';

interface UseInteractTextProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  onPositionChange: (id: number, x: number, y: number, rotation: number) => void;
}

export const useInteractText = ({
  id,
  x,
  y,
  rotation,
  onPositionChange,
}: UseInteractTextProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'style' | 'text' | 'rotate'>('none');
  const [modalPosition, setModalPosition] = useState<{ left: number; top: number }>({ left: x + 100, top: y });
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({ left: x, top: y });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState('#63b3ed');
  const [borderColor, setBorderColor] = useState('#4299e1');
  const [borderSize, setBorderSize] = useState(2);
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [isBorderTransparent, setIsBorderTransparent] = useState(false);

  useEffect(() => {
    if (elementRef.current && !interactableRef.current) {
      interactableRef.current = interact(elementRef.current)
        .draggable({
          inertia: true,
          listeners: {
            move(event) {
              if (isRotating) return;
              const target = event.target as HTMLDivElement;
              const startX = parseFloat(target.getAttribute('data-x') || '0');
              const startY = parseFloat(target.getAttribute('data-y') || '0');
              const newX = startX + event.dx;
              const newY = startY + event.dy;

              target.style.left = `${newX}px`;
              target.style.top = `${newY}px`;

              target.setAttribute('data-x', newX.toString());
              target.setAttribute('data-y', newY.toString());

              setModalPosition({ left: newX + 50, top: newY });
              setDropdownPosition({ left: newX, top: newY });
            },
            end(event) {
              if (isRotating) return;
              const target = event.target as HTMLDivElement;
              const newX = parseFloat(target.getAttribute('data-x') || '0');
              const newY = parseFloat(target.getAttribute('data-y') || '0');
              onPositionChange(id, newX, newY, rotation);
            },
          },
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event: Interact.ResizeEvent) {
              if (isRotating) return; // Disable resize if rotating
              const target = event.target as HTMLDivElement;
              const newWidth = event.rect.width;
              const newHeight = event.rect.height;
            
              let newLeft = parseFloat(target.getAttribute('data-x') || '0');
              let newTop = parseFloat(target.getAttribute('data-y') || '0');

              if (event.edges) {
                if (event.edges.left && event.deltaRect) {
                  newLeft += event.deltaRect.left;
                }
                if (event.edges.top && event.deltaRect) {
                  newTop += event.deltaRect.top;
                }
              }
            
              target.style.width = `${newWidth}px`;
              target.style.height = `${newHeight}px`;
              target.style.left = `${newLeft}px`;
              target.style.top = `${newTop}px`;
            
              target.setAttribute('data-x', newLeft.toString());
              target.setAttribute('data-y', newTop.toString());
            
              setModalPosition({ left: newLeft + 50, top: newTop });
              setDropdownPosition({ left: newLeft, top: newTop });
            },
            end(event) {
              if (isRotating) return;
              const target = event.target as HTMLDivElement;
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
        interactableRef.current.unset();
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
      setIsEditing(!isEditing); 
    }
    if (modalType === 'rotate') {
      setIsRotating(!isRotating); 
    }
    setActiveModal(activeModal === modalType ? 'none' : modalType);
    setIsDropdownOpen(false);
  };

  return {
    elementRef,
    isEditing,
    isRotating,
    activeModal,
    toggleModal,
    handleRotationChange: (newRotation: number) => {
      const target = elementRef.current;
      if (target) {
        target.style.transform = `rotate(${newRotation}deg)`;
        onPositionChange(id, parseFloat(target.getAttribute('data-x') || '0'), parseFloat(target.getAttribute('data-y') || '0'), newRotation);
      }
    },
    modalPosition,
    dropdownPosition,
    isDropdownOpen,
    setIsDropdownOpen,
    backgroundColor,
    borderColor,
    borderSize,
    isBgTransparent,
    isBorderTransparent,
    setBackgroundColor,
    setBorderColor,
    setBorderSize,
    setIsBgTransparent,
    setIsBorderTransparent,
  };
};
