"use client";

import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import TextDropdown from "./TextDropdown";
import HelpModal from "./HelpModal";
import { TextObject, ModalType } from "./types";

const InsertText = () => {
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [nextId, setNextId] = useState(1);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const helpModalRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const addTextObject = () => {
    setTextObjects([
      ...textObjects,
      {
        id: nextId,
        text: "New Text",
        originalText: "New Text",
        isEditing: false,
        isDropdownOpen: false,
        isHelpModalOpen: false,
        helpModalType: null,
        width: 200,
        height: 100,
        x: 50,
        y: 50,
        rotation: 0,
        backgroundColor: "white",
        borderColor: "gray",
        borderSize: 2,
        fontSize: 16,
        isBold: false,
        isItalic: false,
        textColor: "black",
      },
    ]);
    setNextId(nextId + 1);
  };

  const openHelpModal = (id: number, modalType: ModalType) => {
    setTextObjects((objs) =>
      objs.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              isDropdownOpen: false,
              isHelpModalOpen: true,
              helpModalType: modalType,
            }
          : obj
      )
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    setTextObjects((objs) =>
      objs.map((obj) =>
        dropdownRefs.current[obj.id]?.contains(event.target as Node) ||
        helpModalRefs.current[obj.id]?.contains(event.target as Node)
          ? obj
          : { ...obj, isDropdownOpen: false, isHelpModalOpen: false }
      )
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <button
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={addTextObject}
      >
        Add Text
      </button>
      <div className="relative">
        {textObjects.map((obj) => (
          <div key={obj.id}>
            <Rnd
              size={{ width: obj.width, height: obj.height }}
              position={{ x: obj.x, y: obj.y }}
              onDragStop={(e, d) => {
                setTextObjects((objs) =>
                  objs.map((o) => (o.id === obj.id ? { ...o, x: d.x, y: d.y } : o))
                );
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                const newWidth = ref.offsetWidth;
                const newHeight = ref.offsetHeight;
                setTextObjects((objs) =>
                  objs.map((o) =>
                    o.id === obj.id ? { ...o, width: newWidth, height: newHeight } : o
                  )
                );
              }}
              disableDragging={obj.isHelpModalOpen || obj.isEditing}
            >
              <div
                style={{
                  transform: `rotate(${obj.rotation}deg)`,
                  transition: "transform 0.1s ease",
                  backgroundColor: obj.backgroundColor,
                  borderColor: obj.borderColor,
                  borderStyle: "solid",
                  borderWidth: `${obj.borderSize}px`,
                  width: "100%",
                  height: "100%",
                }}
                className="p-4 rounded shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`whitespace-pre-wrap ${obj.isBold ? "font-bold" : ""} ${
                      obj.isItalic ? "italic" : ""
                    }`}
                    style={{
                      fontSize: `${obj.fontSize}px`,
                      display: "inline-block",
                    }}
                  >
                    {obj.text}
                  </span>
                  <TextDropdown
                    obj={obj}
                    setTextObjects={setTextObjects}
                    openHelpModal={(id: number, modalType: ModalType) =>
                      openHelpModal(id, modalType)
                    }
                    dropdownRefs={dropdownRefs}
                  />
                </div>
              </div>
            </Rnd>

            {obj.isHelpModalOpen && (
              <HelpModal
                obj={obj}
                setTextObjects={setTextObjects}
                helpModalRefs={helpModalRefs}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default InsertText;
