import { useState, useEffect } from 'react';

export const useResize = (
  initialSize: { width: number; height: number },
  initialPosition: { x: number; y: number }
) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeOffset, setResizeOffset] = useState({ widthOffset: 0, heightOffset: 0 });
  const [resizeDirection, setResizeDirection] = useState<
    'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >('right');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch (resizeDirection) {
          case 'right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            break;
          case 'bottom':
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            break;
          case 'left':
            newWidth = size.width + position.x - e.clientX;
            newX = e.clientX;
            break;
          case 'top':
            newHeight = size.height + position.y - e.clientY;
            newY = e.clientY;
            break;
          case 'top-left':
            newWidth = size.width + position.x - e.clientX;
            newHeight = size.height + position.y - e.clientY;
            newX = e.clientX;
            newY = e.clientY;
            break;
          case 'top-right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            newHeight = size.height + position.y - e.clientY;
            newY = e.clientY;
            break;
          case 'bottom-left':
            newWidth = size.width + position.x - e.clientX;
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            newX = e.clientX;
            break;
          case 'bottom-right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            break;
        }

        if (newWidth > 50 && newHeight > 50) {
          setSize({ width: newWidth, height: newHeight });
          setPosition({ x: newX, y: newY });
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
  }, [isResizing, position, resizeOffset, resizeDirection, size.width, size.height]);

  const startResizing = (
    e: React.MouseEvent,
    direction: 'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  ) => {
    e.preventDefault();
    setResizeDirection(direction);
    setResizeOffset({
      widthOffset: e.clientX - (position.x + size.width),
      heightOffset: e.clientY - (position.y + size.height),
    });
    setIsResizing(true);
  };

  return {
    size,
    position,
    startResizing,
  };
};
