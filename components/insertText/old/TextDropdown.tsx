import { TextObject, ModalType } from "./types";

interface TextDropdownProps {
  obj: TextObject;
  setTextObjects: React.Dispatch<React.SetStateAction<TextObject[]>>;
  openHelpModal: (id: number, modalType: ModalType) => void;
  dropdownRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

const TextDropdown = ({ obj, setTextObjects, openHelpModal, dropdownRefs }: TextDropdownProps) => {
  const handleDelete = (id: number) => {
    setTextObjects((objs) => objs.filter((obj) => obj.id !== id));
  };

  const toggleEditMode = (id: number) => {
    setTextObjects((objs) =>
      objs.map((obj) =>
        obj.id === id
          ? { ...obj, isEditing: !obj.isEditing, isDropdownOpen: false }
          : obj
      )
    );
  };

  const toggleDropdown = (id: number) => {
    setTextObjects((objs) =>
      objs.map((obj) =>
        obj.id === id
          ? { ...obj, isDropdownOpen: !obj.isDropdownOpen }
          : { ...obj, isDropdownOpen: false }
      )
    );
  };

  return (
    <div
      className="relative"
      ref={(el) => {
        dropdownRefs.current[obj.id] = el;
      }}
    >
      <button className="cursor-pointer" onClick={() => toggleDropdown(obj.id)}>
        <span className="text-2xl font-bold">⁝</span>
      </button>
      {obj.isDropdownOpen && (
        <div className="absolute right-0 top-0 mt-2 p-2 w-32 bg-white border border-gray-200 rounded shadow-md">
          <button
            className="w-full text-left p-1 hover:bg-gray-100"
            onClick={() => toggleEditMode(obj.id)}
          >
            Edit
          </button>
          <button
            className="w-full text-left p-1 hover:bg-gray-100"
            onClick={() => handleDelete(obj.id)}
          >
            Delete
          </button>
          <button
            className="w-full text-left p-1 hover:bg-gray-100"
            onClick={() => openHelpModal(obj.id, "rotate")}
          >
            Rotate
          </button>
          <button
            className="w-full text-left p-1 hover:bg-gray-100"
            onClick={() => openHelpModal(obj.id, "styleBox")}
          >
            Style Box
          </button>
          <button
            className="w-full text-left p-1 hover:bg-gray-100"
            onClick={() => openHelpModal(obj.id, "styleText")}
          >
            Style Text
          </button>
        </div>
      )}
    </div>
  );
};

export default TextDropdown;
