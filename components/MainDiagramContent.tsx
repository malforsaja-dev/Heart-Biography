import { useEditableText } from '../hooks/useEditableText';

interface MainDiagramContentProps {
  texts: {
    text1?: string;
    text2?: string;
    text3?: string;
    text4?: string;
    text5?: string;
    text6?: string;
    text7?: string;
  };
  dates: string[];
}

const MainDiagramContent: React.FC<MainDiagramContentProps> = ({ texts = {}, dates = [] }) => {
  const editableText1 = useEditableText(texts.text1 || '', 300);
  const editableText2 = useEditableText(texts.text2 || '', 300);
  const editableText3 = useEditableText(texts.text3 || '', 300);
  const editableText4 = useEditableText(texts.text4 || '', 300);
  const editableText5 = useEditableText(texts.text5 || '', 300);
  const editableText6 = useEditableText(texts.text6 || '', 300);
  const editableText7 = useEditableText(texts.text7 || '', 300);

  const renderEditableText = (editableText: ReturnType<typeof useEditableText>) => (
    <div
      className={`relative z-10 ${editableText.text === '' ? 'group' : ''}`}
      onClick={(e) => editableText.toggleEditMode(e as React.MouseEvent<HTMLDivElement, MouseEvent>)}
    >
      {editableText.isEditing ? (
        editableText.renderEditor()
      ) : (
        <>
          <p className={`text-center cursor-pointer ${editableText.text === '' ? 'hidden group-hover:block' : ''}`}>
            {editableText.text}
          </p>
          {editableText.text === '' && !editableText.isEditing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="text-2xl  px-32 py-14 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => editableText.toggleEditMode}
              >
                ✏️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-16.5rem)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200"></div>
      
      <div className="absolute left-[5%] bottom-[9%] w-[40%] h-[10%] flex flex-col justify-center">
        {renderEditableText(editableText1)}
      </div>
      <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center">
        <p className="text-center">{dates[0]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[29%] w-[45%] h-[20%] flex flex-col justify-center">
        {renderEditableText(editableText2)}
      </div>
      <div className="absolute left-[13%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[1]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[57%] w-[45%] h-[15%] flex flex-col justify-center">
        {renderEditableText(editableText3)}
      </div>
      <div className="absolute left-[17.5%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[2]}</p>
      </div>
      <div className="absolute left-[25%] top-[5%] w-[50%] h-[15%] flex flex-col justify-center">
        {renderEditableText(editableText4)}
      </div>
      <div className="absolute left-[22%] top-[22%] w-[10%] h-[10%] flex justify-center">
        <p className="text-center">{dates[3]}</p>
      </div>
      <div className="absolute right-[23%] top-[22%] w-[10%] h-[10%] flex justify-center">
        <p className="text-center">{dates[4]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[57%] w-[44%] h-[15%] flex flex-col justify-center">
        {renderEditableText(editableText5)}
      </div>
      <div className="absolute right-[19%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[5]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[33%] w-[44%] h-[15%] flex flex-col justify-center">
        {renderEditableText(editableText6)}
      </div>
      <div className="absolute right-[14%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[6]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[8%] w-[44%] h-[15%] flex flex-col justify-center">
        {renderEditableText(editableText7)}
      </div>
      <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center">
        <p className="text-center">{dates[7]}</p>
      </div>
    </div>
  );
};

export default MainDiagramContent;
