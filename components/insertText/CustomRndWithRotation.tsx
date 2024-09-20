import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const PreciseRotationWithRnd = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 200, height: 100 });
  const [rotation, setRotation] = useState(0);
  const [isRotateMode, setIsRotateMode] = useState(false);
  const rndRef = useRef(null);

  // Handle rotation change with proper type
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(parseInt(e.target.value));
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Toggle Rotate Mode */}
      <button
        style={{
          padding: '10px 20px',
          marginBottom: '10px',
          backgroundColor: isRotateMode ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => setIsRotateMode(!isRotateMode)}
      >
        {isRotateMode ? 'Disable Rotate Mode' : 'Enable Rotate Mode'}
      </button>

      {/* Outer Rotation Wrapper */}
      <div
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          width: size.width,
          height: size.height,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
          pointerEvents: 'none', // Prevent the wrapper from interfering with the drag/resize events
        }}
      >
        {/* Inner Rnd Wrapper */}
        <div style={{ pointerEvents: 'auto' }}> {/* Allow interactions only within this div */}
          <Rnd
            ref={rndRef}
            size={{ width: size.width, height: size.height }}
            position={{ x: 0, y: 0 }} // Keep Rnd at (0,0) relative to the outer wrapper
            onDragStop={(e, d) => {
              if (!isRotateMode) {
                // Update outer position on drag
                setPosition((prev) => ({
                  x: prev.x + d.x,
                  y: prev.y + d.y,
                }));
              }
            }}
            onResize={(e, direction, ref, delta, position) => {
              // Live update the size during resizing to avoid visual jump
              setSize({ width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
            }}
            onResizeStop={(e, direction, ref, delta, newPosition) => {
              if (!isRotateMode) {
                // Convert string width/height (e.g., "200px") to number
                const newWidth = parseInt(ref.style.width, 10);
                const newHeight = parseInt(ref.style.height, 10);

                // Update size and position to avoid visual jump
                setSize({ width: newWidth, height: newHeight });
                setPosition((prev) => ({
                  x: prev.x + newPosition.x,
                  y: prev.y + newPosition.y,
                }));
              }
            }}
            enableResizing={!isRotateMode} // Disable resizing in rotate mode
            disableDragging={isRotateMode} // Disable dragging in rotate mode
            style={{
              border: '1px solid #333',
              borderRadius: '4px',
              padding: '10px',
              background: '#f0f0f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              cursor: isRotateMode ? 'default' : 'move',
              transform: `rotate(-${rotation}deg)`, // Revert rotation effect for correct interactions
              transformOrigin: 'center',
            }}
            // Remove bounds to avoid constraints during testing
            // bounds="parent" 
            minWidth={50} // Minimum width constraint for resizing
            minHeight={50} // Minimum height constraint for resizing
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                cursor: isRotateMode ? 'crosshair' : 'move',
              }}
            >
              Editable Content
            </div>
          </Rnd>
        </div>
      </div>

      {/* Rotation Control */}
      {isRotateMode && (
        <div
          style={{
            position: 'absolute',
            top: position.y + size.height + 10,
            left: position.x,
            width: size.width,
            padding: '10px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label style={{ marginBottom: '5px' }}>Rotate: {rotation}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={handleRotationChange}
            style={{ width: '80%' }}
          />
        </div>
      )}
    </div>
  );
};

export default PreciseRotationWithRnd;
