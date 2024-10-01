import { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';

interface UseInteractTextProps {
  id: string;
  x: number;
  y: number;
  size: {
    width: string,
    height: string,
  };
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
  size,
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

  const onRotationChange = (newRotation: number) => {
    const target = elementRef.current;
    if (target) {
      const x = parseFloat(target.getAttribute('data-x') || '0');
      const y = parseFloat(target.getAttribute('data-y') || '0');
      target.style.transform = `translate(${x}px, ${y}px) rotate(${newRotation}deg)`;
      onPositionChange(id, x, y, newRotation);
    }
  };

  // Effect for updating the style in the parent component
  useEffect(() => {
    onStyleChange(id, {
      backgroundColor,
      borderColor,
      borderSize,
      isBgTransparent,
      isBorderTransparent,
      rotation,
      width: size.width,
      height: size.height,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, borderColor, borderSize, isBgTransparent, isBorderTransparent, rotation]);

  // Effect for initializing interact.js
  useEffect(() => {
    if (elementRef.current && !interactableRef.current) {
      // Convert the changes in width/height into values in the rotated axis
      const cos = Math.cos(rotation * Math.PI / 180);
      const sin = Math.sin(rotation * Math.PI / 180);
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
            target.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation}deg)`;
            target.setAttribute('data-x', newX);
            target.setAttribute('data-y', newY);

            console.log('Dragging position:', { newX, newY });
          },
          end(event) {
            if (isRotating) return;
            const { target } = event;
            const newX = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const newY = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            onPositionChange(id, newX, newY, rotation);
            console.log('Dragging ended with position:', { newX, newY });
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        inertia: true,
        listeners: {
          move(event) {
            if (isRotating) return;
    
            const { target, deltaRect } = event;
            
            // Set the translated position
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            const deltaWidth = deltaRect.width * cos - deltaRect.height * sin;
            const deltaHeight = deltaRect.width * sin + deltaRect.height * cos;

            // Apply size changes to the element
            target.style.width = `${parseFloat(target.style.width) + deltaWidth}px`;
            target.style.height = `${parseFloat(target.style.height) + deltaHeight}px`;

            // Translate based on the changes in position
            x += deltaRect.left;
            y += deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

            // Update position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          end(event) {
            if (isRotating) return;

            const { target, deltaRect } = event;

            const deltaWidth = deltaRect.width * cos - deltaRect.height * sin;
            const deltaHeight = deltaRect.width * sin + deltaRect.height * cos;

            const width = `${parseFloat(target.style.width) + deltaWidth}px`;
            const height = `${parseFloat(target.style.height) + deltaHeight}px`;
    
            // Commit local size state to parent after resizing ends
            onStyleChange(id, { width, height });
            console.log('Resize ended with:', { width, height });
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
    isDropdownOpen,
    backgroundColor,
    borderColor,
    borderSize,
    isBgTransparent,
    isBorderTransparent,
    onRotationChange,
    setIsDropdownOpen,
    setBackgroundColor,
    setBorderColor,
    setBorderSize,
    setIsBgTransparent,
    setIsBorderTransparent,
  };
};
