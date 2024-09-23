
interface DropdownMenuProps {
  onEditText: () => void;
  onEditStyle: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEditText,
  onEditStyle,
  onRotate,
  onDelete,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded">
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onEditText}
      >
        Edit Text
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onEditStyle}
      >
        Edit Background
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onRotate}
      >
        Rotate
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default DropdownMenu;
