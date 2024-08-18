import { useState, useEffect } from 'react';

export const useResize = (
  initialSize: { width: number; height: number },
  position: { x: number; y: number }
) => {
  const [size, setSize] = useState(initialSize);
  const [positionState, setPositionState] = useState(position);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeOffset, setResizeOffset] = useState({ widthOffset: 0, heightOffset: 0 });
  const [resizeDirection, setResizeDirection] = useState<'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('right');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = positionState.x;
        let newY = positionState.y;

        switch (resizeDirection) {
          case 'right':
            newWidth = e.clientX - positionState.x - resizeOffset.widthOffset;
            break;
          case 'bottom':
            newHeight = e.clientY - positionState.y - resizeOffset.heightOffset;
            break;
          case 'left':
            newWidth = size.width + positionState.x - e.clientX;
            newX = e.clientX;
            break;
          case 'top':
            newHeight = size.height + positionState.y - e.clientY;
            newY = e.clientY;
            break;
          case 'top-left':
            newWidth = size.width + positionState.x - e.clientX;
            newHeight = size.height + positionState.y - e.clientY;
            newX = e.clientX;
            newY = e.clientY;
            break;
          case 'top-right':
            newWidth = e.clientX - positionState.x - resizeOffset.widthOffset;
            newHeight = size.height + positionState.y - e.clientY;
            newY = e.clientY;
            break;
          case 'bottom-left':
            newWidth = size.width + positionState.x - e.clientX;
            newHeight = e.clientY - positionState.y - resizeOffset.heightOffset;
            newX = e.clientX;
            break;
          case 'bottom-right':
            newWidth = e.clientX - positionState.x - resizeOffset.widthOffset;
            newHeight = e.clientY - positionState.y - resizeOffset.heightOffset;
            break;
        }

        if (newWidth > 50 && newHeight > 50) {
          setSize({ width: newWidth, height: newHeight });
          setPositionState({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, positionState, resizeOffset, resizeDirection, size.width, size.height]);

  const startResizing = (e: React.MouseEvent, direction: 'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    e.preventDefault();
    setResizeDirection(direction);
    setResizeOffset({
      widthOffset: e.clientX - (positionState.x + size.width),
      heightOffset: e.clientY - (positionState.y + size.height),
    });
    setIsResizing(true);
  };

  return {
    size,
    position: positionState,
    startResizing,
    isResizing,  // Expose isResizing state
  };
};
