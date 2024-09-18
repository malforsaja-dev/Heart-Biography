import { TextObject } from "./types";

interface HelpModalProps {
  obj: TextObject;
  setTextObjects: React.Dispatch<React.SetStateAction<TextObject[]>>;
  helpModalRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

const HelpModal = ({ obj, setTextObjects, helpModalRefs }: HelpModalProps) => {
  const closeHelpModal = () => {
    setTextObjects((objs) =>
      objs.map((o) =>
        o.id === obj.id ? { ...o, isHelpModalOpen: false, helpModalType: null } : o
      )
    );
  };

  return (
    <div
      ref={(el) => {
        helpModalRefs.current[obj.id] = el;
      }}
      className="absolute z-10 right-0 top-0 p-4 bg-white border border-gray-300 shadow-md rounded"
    >
      {obj.helpModalType === "rotate" && (
        <div>
          <label className="block">Rotate Text:</label>
          <input
            type="range"
            min="0"
            max="360"
            value={obj.rotation}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, rotation: parseInt(e.target.value) } : o
                )
              )
            }
          />
          <button className="mt-2 p-1 bg-blue-500 text-white rounded" onClick={closeHelpModal}>
            Done
          </button>
        </div>
      )}

      {obj.helpModalType === "styleBox" && (
        <div>
          <label className="block">Background Color:</label>
          <input
            type="color"
            value={obj.backgroundColor}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, backgroundColor: e.target.value } : o
                )
              )
            }
          />
          <label className="block mt-2">Border Color:</label>
          <input
            type="color"
            value={obj.borderColor}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, borderColor: e.target.value } : o
                )
              )
            }
          />
          <label className="block mt-2">Border Size:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={obj.borderSize}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, borderSize: parseInt(e.target.value) } : o
                )
              )
            }
          />
          <button className="mt-2 p-1 bg-blue-500 text-white rounded" onClick={closeHelpModal}>
            Done
          </button>
        </div>
      )}

      {obj.helpModalType === "styleText" && (
        <div>
          <label className="block">Font Size:</label>
          <input
            type="number"
            min="10"
            max="48"
            value={obj.fontSize}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, fontSize: parseInt(e.target.value) } : o
                )
              )
            }
          />
          <label className="block mt-2">Text Color:</label>
          <input
            type="color"
            value={obj.textColor || "#000000"}
            onChange={(e) =>
              setTextObjects((objs) =>
                objs.map((o) =>
                  o.id === obj.id ? { ...o, textColor: e.target.value } : o
                )
              )
            }
          />
          <div className="mt-2">
            <label>
              <input
                type="checkbox"
                checked={obj.isBold}
                onChange={() =>
                  setTextObjects((objs) =>
                    objs.map((o) =>
                      o.id === obj.id ? { ...o, isBold: !o.isBold } : o
                    )
                  )
                }
              />
              Bold
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                checked={obj.isItalic}
                onChange={() =>
                  setTextObjects((objs) =>
                    objs.map((o) =>
                      o.id === obj.id ? { ...o, isItalic: !o.isItalic } : o
                    )
                  )
                }
              />
              Italic
            </label>
          </div>
          <button className="mt-2 p-1 bg-blue-500 text-white rounded" onClick={closeHelpModal}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpModal;
