import { useState, useEffect } from 'react';

export const useResize = (
  initialSize: { width: number; height: number },
  position: { x: number; y: number },
  aspectRatio?: number // Add an optional aspect ratio parameter
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeOffset, setResizeOffset] = useState({ widthOffset: 0, heightOffset: 0 });
  const [resizeDirection, setResizeDirection] = useState<'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('right');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;

        switch (resizeDirection) {
          case 'right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            break;
          case 'bottom':
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            break;
          case 'left':
            newWidth = size.width - (e.clientX - position.x);
            break;
          case 'top':
            newHeight = size.height - (e.clientY - position.y);
            break;
          case 'top-left':
            newWidth = size.width - (e.clientX - position.x);
            newHeight = size.height - (e.clientY - position.y);
            break;
          case 'top-right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            newHeight = size.height - (e.clientY - position.y);
            break;
          case 'bottom-left':
            newWidth = size.width - (e.clientX - position.x);
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            break;
          case 'bottom-right':
            newWidth = e.clientX - position.x - resizeOffset.widthOffset;
            newHeight = e.clientY - position.y - resizeOffset.heightOffset;
            break;
        }

        if (newWidth > 50) setSize((size) => ({ ...size, width: newWidth }));
        if (newHeight > 50) setSize((size) => ({ ...size, height: newHeight }));
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
  }, [isResizing, position, resizeOffset, resizeDirection]);

  const startResizing = (e: React.MouseEvent, direction: 'right' | 'bottom' | 'left' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
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
    startResizing,
  };
};
