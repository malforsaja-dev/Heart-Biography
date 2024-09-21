import { useState, useEffect } from 'react';
import interact from 'interactjs';

interface UseInsertTextProps {
  id: number;
  initialContent: string;
  onContentChange: (content: string, id: number) => void;
  onEdit: (id: number | null) => void;
}

const useInsertText = ({ id, initialContent, onContentChange, onEdit }: UseInsertTextProps) => {
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [previousContent, setPreviousContent] = useState(initialContent);
  const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'style'>('none');
  const [bgColor, setBgColor] = useState('#63b3ed');
  const [borderSize, setBorderSize] = useState(2);
  const [borderColor, setBorderColor] = useState('#4299e1');
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [isBorderTransparent, setIsBorderTransparent] = useState(false);

  const isEditMode = activeModal !== 'none';

  // Setup interactions based on the current mode
  useEffect(() => {
    const interactable = interact(`#element-${id}`);

    interactable.draggable({
      enabled: !isEditMode,
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px) rotate(${parseFloat(
            target.getAttribute('data-rotation') || '0'
          )}deg)`;

          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
      },
    });

    interactable.resizable({
      enabled: !isEditMode,
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          const target = event.target;
          const width = parseFloat(target.style.width) + event.deltaRect.width;
          const height = parseFloat(target.style.height) + event.deltaRect.height;

          const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.deltaRect.left;
          const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.deltaRect.top;

          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${x}px, ${y}px) rotate(${parseFloat(
            target.getAttribute('data-rotation') || '0'
          )}deg)`;

          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
      },
    });

    return () => {
      interactable.unset(); // Cleanup on unmount
    };
  }, [isEditMode, id]);

  // Handle accepting the changes
  const handleAccept = () => {
    onContentChange(currentContent, id);
    handleModalState('none');
  };

  // Handle declining the changes
  const handleDecline = () => {
    setCurrentContent(previousContent);
    handleModalState('none');
  };

  // Handle modal state changes
  const handleModalState = (modalType: 'none' | 'edit' | 'style') => {
    setActiveModal(modalType);
    if (modalType === 'none') {
      onEdit(null);
    } else {
      onEdit(id);
    }
  };

  // Handle background color change
  const handleBgColorChange = (color: string) => {
    if (!isBgTransparent) {
      setBgColor(color);
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
    if (isBgTransparent) {
      setBgColor('#63b3ed');
    }
    setIsBgTransparent(!isBgTransparent);
  };

  // Toggle border transparency
  const toggleBorderTransparency = () => {
    if (isBorderTransparent) {
      setBorderColor('#4299e1');
    }
    setIsBorderTransparent(!isBorderTransparent);
  };

  return {
    currentContent,
    setCurrentContent,
    previousContent,
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
  };
};

export default useInsertText;
