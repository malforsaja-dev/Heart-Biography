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
  const [isEditing, setIsEditing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'style' | 'text' | 'rotate'>('none');
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
            const { target } = event;
            const newX = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const newY = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
            // Update local position state during dragging
            target.style.transform = `translate(${newX}px, ${newY}px)`;
            target.setAttribute('data-x', newX);
            target.setAttribute('data-y', newY);

            console.log('Dragging position:', { newX, newY });
          }
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            if (isRotating) return;
    
            let { width, height } = event.rect;
            const { target } = event;

            // Set the translated position
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);
    
            if (event.edges) {
              if (event.edges.left && event.deltaRect) {
                x += event.deltaRect.left;
              }
              if (event.edges.top && event.deltaRect) {
                y += event.deltaRect.top;
              }
            }

            // Adjust translation during resizing
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // Update position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
  
            console.log('Resizing in progress:', { x, y });
          },
          end(event) {
            if (isRotating) return;
            const newWidth = event.rect.width;
            const newHeight = event.rect.height;
    
            // Commit local size state to parent after resizing ends
            onStyleChange(id, { width: newWidth, height: newHeight });
            console.log('Resize ended with:', { newWidth, newHeight });
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
  }, [rotation, id, onPositionChange, onStyleChange, isRotating]);

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
