// StyleBox.tsx
import React from 'react';

interface StyleBoxProps {
  backgroundColor: string;
  borderColor: string;
  borderSize: number;
  isBgTransparent: boolean;
  isBorderTransparent: boolean;
  style?: object;
  onBgColorChange: (color: string) => void;
  onBorderColorChange: (color: string) => void;
  onBorderSizeChange: (size: number) => void;
  onBgTransparencyToggle: () => void;
  onBorderTransparencyToggle: () => void;
  onClose: () => void;
}

const StyleBox: React.FC<StyleBoxProps> = ({
  backgroundColor,
  borderColor,
  borderSize,
  isBgTransparent,
  isBorderTransparent,
  style,
  onBgColorChange,
  onBorderColorChange,
  onBorderSizeChange,
  onBgTransparencyToggle,
  onBorderTransparencyToggle,
  onClose,
}) => {
  return (
    <div 
      className="absolute bottom-[-180px] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80"
      style={style}
    >
      <h3 className="text-lg font-bold mb-4 text-center">Style Box</h3>
      <div className="mb-4 flex items-center justify-between">
        <label className="font-semibold">Background:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onBgColorChange(e.target.value)}
          className="border p-1"
          disabled={isBgTransparent}
        />
        <label className="flex items-center ml-2">
          <input
            type="checkbox"
            checked={isBgTransparent}
            onChange={onBgTransparencyToggle}
            className="mr-1"
          />
          Transparent
        </label>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <label className="font-semibold">Border Size:</label>
        <input
          type="number"
          value={borderSize}
          onChange={(e) => onBorderSizeChange(Number(e.target.value))}
          className="border p-1 w-16"
          min={0}
          max={10}
          disabled={isBorderTransparent}
        />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <label className="font-semibold">Border Color:</label>
        <input
          type="color"
          value={borderColor}
          onChange={(e) => onBorderColorChange(e.target.value)}
          className="border p-1"
          disabled={isBorderTransparent}
        />
        <label className="flex items-center ml-2">
          <input
            type="checkbox"
            checked={isBorderTransparent}
            onChange={onBorderTransparencyToggle}
            className="mr-1"
          />
          Transparent
        </label>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default StyleBox;
