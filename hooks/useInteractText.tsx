import { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';

interface UseInteractTextProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  backgroundColor: string;
  borderColor: string;
  borderSize: number;
  isBgTransparent: boolean;
  isBorderTransparent: boolean;
  onPositionChange: (id: string, x: number, y: number, rotation: number) => void;
  onStyleChange: (id: string, newStyle: any) => void;
}

export const useInteractText = ({
  id,
  x,
  y,
  rotation,
  backgroundColor: initialBgColor,
  borderColor: initialBorderColor,
  borderSize: initialBorderSize,
  isBgTransparent: initialBgTransparent,
  isBorderTransparent: initialBorderTransparent,
  onPositionChange,
  onStyleChange,
}: UseInteractTextProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);

  // Local state for tracking position and size changes
  const [localPosition, setLocalPosition] = useState({ x, y });
  const [localSize, setLocalSize] = useState({ width: '200px', height: '100px' });

  const [isEditing, setIsEditing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'style' | 'text' | 'rotate'>('none');
  const [modalPosition, setModalPosition] = useState<{ left: number; top: number }>({ left: x + 100, top: y });
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({ left: x, top: y });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState(initialBgColor);
  const [borderColor, setBorderColor] = useState(initialBorderColor);
  const [borderSize, setBorderSize] = useState(initialBorderSize);
  const [isBgTransparent, setIsBgTransparent] = useState(initialBgTransparent);
  const [isBorderTransparent, setIsBorderTransparent] = useState(initialBorderTransparent);

  // Effect for updating the style in the parent component
  useEffect(() => {
    onStyleChange(id, {
      backgroundColor,
      borderColor,
      borderSize,
      isBgTransparent,
      isBorderTransparent,
      rotation,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, borderColor, borderSize, isBgTransparent, isBorderTransparent, rotation]);

  // Effect for initializing interact.js
  useEffect(() => {
    if (elementRef.current && !interactableRef.current) {
      interactableRef.current = interact(elementRef.current)
      .draggable({
        inertia: true,
        listeners: {
          move(event) {
            if (isRotating) return;
            const target = event.target as HTMLDivElement;
            const newX = localPosition.x + event.dx;
            const newY = localPosition.y + event.dy;
    
            // Update local position state during dragging
            setLocalPosition({ x: newX, y: newY });
    
            target.style.transform = `translate(${newX}px, ${newY}px)`;
            target.setAttribute('data-x', newX.toString());
            target.setAttribute('data-y', newY.toString());
    
            setModalPosition({ left: newX + 50, top: newY });
            setDropdownPosition({ left: newX, top: newY });
            console.log('Dragging position:', { newX, newY });
          },
          end(event) {
            if (isRotating) return;
            const newX = localPosition.x;
            const newY = localPosition.y;
    
            // Commit local position state to parent
            onPositionChange(id, newX, newY, rotation);
            console.log('Dragging ended with position:', { newX, newY });
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event: Interact.ResizeEvent) {
            if (isRotating) return;
    
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
    
            // Update local size and position state during resizing
            setLocalSize({ width: `${newWidth}px`, height: `${newHeight}px` });
            setLocalPosition({ x: newLeft, y: newTop });
    
            setModalPosition({ left: newLeft + 50, top: newTop });
            setDropdownPosition({ left: newLeft, top: newTop });
            console.log('Resizing in progress:', { newWidth, newHeight, newLeft, newTop });
          },
          end(event) {
            if (isRotating) return;
            const target = event.target as HTMLDivElement;
            const newWidth = event.rect.width;
            const newHeight = event.rect.height;
            const newX = parseFloat(target.getAttribute('data-x') || '0');
            const newY = parseFloat(target.getAttribute('data-y') || '0');
    
            // Commit local size state to parent after resizing ends
            onStyleChange(id, { width: newWidth, height: newHeight });
            onPositionChange(id, newX, newY, rotation);
            console.log('Resize ended with:', { newWidth, newHeight, newX, newY });
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
  }, [rotation, id, localPosition, localSize, onPositionChange, onStyleChange, isRotating]);

  // Enable/disable interact.js interactions based on editing/rotating state
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
