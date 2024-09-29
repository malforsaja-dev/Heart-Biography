import { useInteractText } from '@/hooks/useInteractText';
import DropdownMenu from './DropdownMenu';
import StyleBox from './StyleBox';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

interface InsertTextProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  size: { width: string; height: string };
  content: string;
  backgroundColor: string;
  borderColor: string;
  borderSize: number;
  isBgTransparent: boolean;
  isBorderTransparent: boolean;
  onContentChange: (id: string, content: string) => void;
  onPositionChange: (id: string, x: number, y: number, rotation: number) => void;
  onStyleChange: (id: string, newStyle: any) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const InsertText: React.FC<InsertTextProps> = ({
  id,
  x,
  y,
  rotation,
  size,
  content,
  backgroundColor,
  borderColor,
  borderSize,
  isBgTransparent,
  isBorderTransparent,
  onContentChange,
  onPositionChange,
  onStyleChange,
  onDelete,
  className,
}) => {
  const {
    elementRef,
    isEditing,
    activeModal,
    toggleModal,
    handleRotationChange,
    isDropdownOpen,
    setIsDropdownOpen,
    setBackgroundColor,
    setBorderColor,
    setBorderSize,
    setIsBgTransparent,
    setIsBorderTransparent,
  } = useInteractText({
    id,
    x,
    y,
    rotation,
    backgroundColor,
    borderColor,
    borderSize,
    isBgTransparent,
    isBorderTransparent,
    onPositionChange,
    onStyleChange,
  });

  useEffect(() => {
    console.log('InsertText component rendered with props:', {
      id,
      size,
      content,
      x,
      y,
      backgroundColor,
      borderColor,
      borderSize,
    });
  }, [id, size, content, x, y, backgroundColor, borderColor, borderSize]);

  return (
    <div className="relative z-20">
      <div
        ref={elementRef}
        className={`absolute w-64 h-64 rounded-md border ${className} group`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: isBgTransparent ? 'transparent' : backgroundColor,
          borderColor: isBorderTransparent ? 'transparent' : borderColor,
          borderWidth: `${borderSize}px`,
          zIndex: id,
          width: size.width,
          height: size.height,
          cursor: isEditing ? 'text' : 'move',
          userSelect: isEditing ? 'text' : 'none',
          transform: `rotate(${rotation}deg)`,
        }}
        data-x={0}
        data-y={0}
      >
        <div className='relative w-full h-full p-4'>
          {!isEditing && (
            <div
              className="w-full h-full overflow-auto ql-editor"
              style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="bg-amber-300 border-2 border-red-500 px-2 rounded-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              &#x22EE;
            </button>
          </div>

          {activeModal === 'style' && (
            <StyleBox
              backgroundColor={backgroundColor}
              borderColor={borderColor}
              borderSize={borderSize}
              isBgTransparent={isBgTransparent}
              isBorderTransparent={isBorderTransparent}
              onBgColorChange={setBackgroundColor}
              onBorderColorChange={setBorderColor}
              onBorderSizeChange={setBorderSize}
              onBgTransparencyToggle={() => setIsBgTransparent(!isBgTransparent)}
              onBorderTransparencyToggle={() => setIsBorderTransparent(!isBorderTransparent)}
              onClose={() => toggleModal('style')}
            />
          )}

          {activeModal === 'text' && (
            <TextEditor
              id={id}
              content={content}
              onContentChange={(newContent, id) => {
                console.log('onContentChange triggered for id:', id, ' with content:', newContent);
                onContentChange(id, newContent);
              }}
              onClose={() => {
                toggleModal('text');
              }}
            />
          )}
          {isDropdownOpen && (
            <DropdownMenu
              className='top-8 z-10'
              onEditText={() => toggleModal('text')}
              onEditStyle={() => toggleModal('style')}
              onRotate={() => toggleModal('rotate')}
              onDelete={() => onDelete(id)}
            />
          )}

          {activeModal === 'rotate' && (
            <div className="absolute bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50 w-80">
              <h3 className="text-lg font-bold mb-4 text-center">Rotate Box</h3>
              <div className="flex items-center justify-between">
                <label className="font-semibold">Rotation (°):</label>
                <input
                  type="number"
                  value={rotation}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  className="border p-1 w-16"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => toggleModal('rotate')}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsertText;
