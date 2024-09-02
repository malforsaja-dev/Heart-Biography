import { useEditableText } from '@/hooks/useEditableText';
import { saveText } from '@/utils/saveText';

interface MainDiagramContentProps {
  texts: Record<string, any>;
  dates: string[];
  userId: string;
  diagramIndex: number;
}

const MainDiagramContent: React.FC<MainDiagramContentProps> = ({ texts = {}, dates = [], userId, diagramIndex }) => {
  const editableText1 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text1 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text1', newText),
  });

  const editableText2 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text2 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text2', newText),
  });

  const editableText3 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text3 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text3', newText),
  });

  const editableText4 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text4 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text4', newText),
  });

  const editableText5 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text5 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text5', newText),
  });

  const editableText6 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text6 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text6', newText),
  });

  const editableText7 = useEditableText({
    initialText: texts[`diagram${diagramIndex + 1}`]?.text7 || '',
    maxLength: 300,
    onSave: (newText) => saveText(userId, diagramIndex, 'text7', newText),
  });

  const renderEditableText = (editableText: ReturnType<typeof useEditableText>) => (
    <div
      className={`relative z-10 ${editableText.text === '' ? 'group' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        editableText.toggleEditMode(e);
      }}
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
                className="text-2xl px-32 py-14 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  editableText.toggleEditMode(e);
                }}
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
      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200 z-0"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200 z-0"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200 z-0"></div>
      
      <div className="absolute left-[5%] bottom-[9%] w-[40%] h-[10%] flex flex-col justify-center z-20">
        {renderEditableText(editableText1)}
      </div>
      <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[0]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[29%] w-[45%] h-[20%] flex flex-col justify-center z-20">
        {renderEditableText(editableText2)}
      </div>
      <div className="absolute left-[13%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[1]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[57%] w-[45%] h-[15%] flex flex-col justify-center z-20">
        {renderEditableText(editableText3)}
      </div>
      <div className="absolute left-[17.5%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[2]}</p>
      </div>
      <div className="absolute left-[25%] top-[5%] w-[50%] h-[15%] flex flex-col justify-center z-20">
        {renderEditableText(editableText4)}
      </div>
      <div className="absolute left-[22%] top-[22%] w-[10%] h-[10%] flex justify-center z-20">
        <p className="text-center">{dates[3]}</p>
      </div>
      <div className="absolute right-[23%] top-[22%] w-[10%] h-[10%] flex justify-center z-20">
        <p className="text-center">{dates[4]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[57%] w-[44%] h-[15%] flex flex-col justify-center z-20">
        {renderEditableText(editableText5)}
      </div>
      <div className="absolute right-[19%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[5]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[33%] w-[44%] h-[15%] flex flex-col justify-center z-20">
        {renderEditableText(editableText6)}
      </div>
      <div className="absolute right-[14%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[6]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[8%] w-[44%] h-[15%] flex flex-col justify-center z-20">
        {renderEditableText(editableText7)}
      </div>
      <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[7]}</p>
      </div>
    </div>
  );
};

export default MainDiagramContent;
