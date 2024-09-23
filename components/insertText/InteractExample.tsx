import { useInsertText } from '@/hooks/useInsertText';
import InsertText from '@/components/insertText/InsertText';

const InteractExample: React.FC = () => {
  const {
    elements,
    addElement,
    updateElement,
    updateElementPosition,
    deleteElement,
  } = useInsertText();

  return (
    <div className="relative w-[90vw] h-[90vh] bg-gray-100">

      {/* {elements.map((element) => (
        <InsertText
          key={element.id}
          id={element.id}
          x={element.x}
          y={element.y}
          rotation={element.rotation}
          content={element.content}
          onContentChange={(content) => updateElement(element.id, content)}
          onPositionChange={(id, x, y, rotation) => updateElementPosition(id, x, y, rotation)}
          onDelete={() => deleteElement(element.id)}
        />
      ))} */}

      {/* Add Element Button */}
      <button
        className="absolute bottom-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={addElement}
      >
        Add Element
      </button>
    </div>
  );
};

export default InteractExample;
