import UploadImage from '@/components/UploadImage';
import { useLanguage } from '@/context/LanguageContext';

interface ButtonsProps {
  currentPage: number;
  addTextElement: (currentPage: number) => void;
  flipPage: (currentPage: number) => void;
  saveToDatabase: () => void;
  addImageElement: (url: string, currentPage: number) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ currentPage, addTextElement, flipPage, saveToDatabase, addImageElement }) => {
  const { texts } = useLanguage();

  return (
    <div className="py-5 text-center">
      {currentPage === 0 ? (
        <div className="py-2 invisible">text</div> // Reserve space for consistency
      ) : (
        <>
          {currentPage >= 4 && (
            <div className='flex justify-center'>
              <button onClick={() => addTextElement(currentPage)} className="bg-blue-500 text-white px-4 py-2 mr-2">
                {texts.fotobook?.addText}
              </button>
              <button onClick={saveToDatabase} className="bg-green-500 text-white px-4 py-2 mr-2">
                Save
              </button>
              <UploadImage onUploadSuccess={(url) => addImageElement(url, currentPage)} />
              <button onClick={() => flipPage(currentPage)} className="bg-yellow-500 text-white px-4 py-2 ml-20 shadow-md">
                {texts.fotobook?.flipPage}
              </button>
            </div>
          )}

          {currentPage === 2 && (
            <button onClick={() => flipPage(currentPage)} className="bg-yellow-500 text-white px-4 py-2">
              {texts.fotobook?.flipPage}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Buttons;
