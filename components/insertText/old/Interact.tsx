import React, { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import QuillEditor from './QuillEditor'; // Import the QuillEditor component

type ElementProps = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  isDropdownOpen: boolean;
  isEditing: boolean;
  content: string;
};

const InteractExample: React.FC = () => {
  const [elements, setElements] = useState<ElementProps[]>([
    {
      id: 1,
      x: 0,
      y: 0,
      rotation: 0,
      isDropdownOpen: false,
      isEditing: false,
      content: '<p>Element 1 Content</p>',
    },
    {
      id: 2,
      x: 250,
      y: 250,
      rotation: 0,
      isDropdownOpen: false,
      isEditing: false,
      content: '<p>Element 2 Content</p>',
    },
  ]);
  const [nextId, setNextId] = useState(3);

  useEffect(() => {
    elements.forEach((element) => {
      const target = document.getElementById(`element-${element.id}`);
      if (!target) return;

      interact(target)
        .draggable({
          listeners: {
            move(event) {
              const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
              const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

              target.style.transform = `translate(${x}px, ${y}px) rotate(${parseFloat(
                target.getAttribute('data-rotation') || '0'
              )}deg)`;

              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());
            },
          },
          inertia: true,
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
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
          inertia: true,
        })
        .gesturable({
          listeners: {
            start(event) {
              target.setAttribute(
                'data-rotation',
                (parseFloat(target.getAttribute('data-rotation') || '0') || 0).toString()
              );
            },
            move(event) {
              const currentRotation = parseFloat(target.getAttribute('data-rotation') || '0') || 0;
              const newRotation = currentRotation + event.da;

              const x = parseFloat(target.getAttribute('data-x') || '0') || 0;
              const y = parseFloat(target.getAttribute('data-y') || '0') || 0;

              target.style.transform = `translate(${x}px, ${y}px) rotate(${newRotation}deg)`;
              target.setAttribute('data-rotation', newRotation.toString());
            },
          },
        });
    });

    return () => {
      elements.forEach((element) => {
        const target = document.getElementById(`element-${element.id}`);
        if (target) interact(target).unset();
      });
    };
  }, [elements]);

  const handleAddElement = () => {
    setElements([
      ...elements,
      { id: nextId, x: 0, y: 0, rotation: 0, isDropdownOpen: false, isEditing: false, content: `<p>Element ${nextId} Content</p>` },
    ]);
    setNextId(nextId + 1);
  };

  const handleDeleteElement = (id: number) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const toggleDropdown = (id: number) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, isDropdownOpen: !el.isDropdownOpen } : { ...el, isDropdownOpen: false }
      )
    );
  };

  const toggleEdit = (id: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, isEditing: !el.isEditing, isDropdownOpen: false } : el))
    );
  };

  const handleContentChange = (content: string, id: number) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, content } : el))
    );
  };

  return (
    <div className="relative w-[90vw] h-[90vh] bg-gray-100">
      {elements.map((element) => (
        <div
          key={element.id}
          id={`element-${element.id}`}
          className="absolute bg-blue-300 border-2 border-blue-500 flex items-center justify-center cursor-move"
          style={{
            width: '200px',
            height: '200px',
            transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation}deg)`,
          }}
          data-x={element.x}
          data-y={element.y}
          data-rotation={element.rotation}
        >
          <div className="relative w-full h-full">
            {/* Three-dot menu */}
            <div className="absolute top-1 right-1">
              <div className="dropdown relative">
                <button
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => toggleDropdown(element.id)}
                >
                  &#x22EE; {/* Vertical three dots icon */}
                </button>
                <div
                  className={`${
                    element.isDropdownOpen ? 'block' : 'hidden'
                  } absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10`}
                >
                  <button
                    className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                    onClick={() => handleDeleteElement(element.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="block px-4 py-2 text-blue-600 hover:bg-blue-100 w-full text-left"
                    onClick={() => toggleEdit(element.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
            {element.isEditing ? (
              <div className="w-full h-full p-2">
                {/* <QuillEditor
                  content={element.content}
                  id={element.id}
                  onContentChange={handleContentChange}
                /> */}
              </div>
            ) : (
              <div className="text-center text-gray-700 p-2" dangerouslySetInnerHTML={{ __html: element.content }} />
            )}
          </div>
        </div>
      ))}

      {/* Add Element Button */}
      <button
        className="absolute bottom-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={handleAddElement}
      >
        Add Element
      </button>
    </div>
  );
};

export default InteractExample;
