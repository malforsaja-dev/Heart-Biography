"use client"; // Mark this as a client component

import React, { useEffect, useState } from 'react';
import { useDrag } from '@/app/hooks/useDrag';
import { useResize } from '@/app/hooks/useResize';
import Image from 'next/image';

type BoxProps = {
  content: React.ReactNode;
  defaultWidth?: string;
  defaultHeight?: string;
  isImage?: boolean;
};

const DraggableResizableBox = ({ content, defaultWidth = '100px', defaultHeight = '100px', isImage = false }: BoxProps) => {
  const initialWidth = parseInt(defaultWidth);
  const initialHeight = parseInt(defaultHeight);
  const aspectRatio = isImage ? initialWidth / initialHeight : undefined;

  const { position, startDragging } = useDrag({ x: 50, y: 50 });
  const { size, startResizing } = useResize({ width: initialWidth, height: initialHeight }, position, aspectRatio);

  const [adjustedSize, setAdjustedSize] = useState({ width: size.width, height: size.height });

  useEffect(() => {
    if (aspectRatio) {
      let newWidth = size.width;
      let newHeight = size.height;

      if (size.width / aspectRatio < size.height) {
        newHeight = size.width / aspectRatio;
      } else {
        newWidth = size.height * aspectRatio;
      }

      setAdjustedSize({ width: newWidth, height: newHeight });
    }
  }, [size, aspectRatio]);

  // Prevent the box from being resized smaller than the image's original size
  const minWidth = initialWidth;
  const minHeight = initialHeight;

  return (
    <div
      className="absolute bg-gray-200 border border-gray-400"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${Math.max(size.width, minWidth)}px`,
        height: `${Math.max(size.height, minHeight)}px`,
        zIndex: 10,
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('resize-handle')) {
          startDragging(e);
        }
      }}
    >
      {isImage ? (
        <Image
          src={(content as any).props.src}
          alt={(content as any).props.alt}
          width={adjustedSize.width}
          height={adjustedSize.height}
          style={{
            objectFit: 'contain',
          }}
        />
      ) : (
        content
      )}
      {/* Right Resize Handle */}
      <div
        className="absolute right-0 top-0 h-full w-2 cursor-ew-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'right')}
      />
      {/* Bottom Resize Handle */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'bottom')}
      />
      {/* Left Resize Handle */}
      <div
        className="absolute left-0 top-0 h-full w-2 cursor-ew-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'left')}
      />
      {/* Top Resize Handle */}
      <div
        className="absolute top-0 left-0 w-full h-2 cursor-ns-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'top')}
      />
      {/* Top-Left Corner Resize Handle */}
      <div
        className="absolute top-0 left-0 w-2 h-2 cursor-nwse-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'top-left')}
      />
      {/* Top-Right Corner Resize Handle */}
      <div
        className="absolute top-0 right-0 w-2 h-2 cursor-nesw-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'top-right')}
      />
      {/* Bottom-Left Corner Resize Handle */}
      <div
        className="absolute bottom-0 left-0 w-2 h-2 cursor-nesw-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'bottom-left')}
      />
      {/* Bottom-Right Corner Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize resize-handle"
        onMouseDown={(e) => startResizing(e, 'bottom-right')}
      />
    </div>
  );
};

export default DraggableResizableBox;
