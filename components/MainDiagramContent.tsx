import { useEditableText } from '@/hooks/useEditableText';
import { saveText } from '@/utils/saveText';

interface MainDiagramContentProps {
  texts: Record<string, any>;
  dates: string[];
  userId: string;
  diagramIndex: number;
}

const EditableText: React.FC<{ keyName: string; text: string; userId: string; diagramIndex: number }> = ({
  keyName,
  text,
  userId,
  diagramIndex,
}) => {
  const editableText = useEditableText({
    initialText: text || '',
    onSave: (newText) => saveText(userId, diagramIndex, keyName, newText),
  });

  return (
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
};

const MainDiagramContent: React.FC<MainDiagramContentProps> = ({ texts = {}, dates = [], userId, diagramIndex }) => {
  const textConfig = [
    { key: 'text1', position: 'absolute left-[5%] bottom-[9%] w-[40%] h-[10%]' },
    { key: 'text2', position: 'absolute left-[5%] bottom-[29%] w-[45%] h-[20%]' },
    { key: 'text3', position: 'absolute left-[5%] bottom-[58%] w-[45%] h-[15%]' },
    { key: 'text4', position: 'absolute left-[25%] top-[5%] w-[50%] h-[15%]' },
    { key: 'text5', position: 'absolute right-[5%] bottom-[57%] w-[44%] h-[15%]' },
    { key: 'text6', position: 'absolute right-[5%] bottom-[33%] w-[44%] h-[15%]' },
    { key: 'text7', position: 'absolute right-[5%] bottom-[8%] w-[44%] h-[15%]' },
  ];

  return (
    <div className="relative h-[calc(100vh-16.5rem)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200 z-0"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200 z-0"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200 z-0"></div>

      {textConfig.map(({ key, position }) => (
        <div className={position} key={key}>
          <EditableText keyName={key} text={texts[key]} userId={userId} diagramIndex={diagramIndex} />
        </div>
      ))}

      <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[0]}</p>
      </div>
      <div className="absolute left-[13%] bottom-[22%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[1]}</p>
      </div>
      <div className="absolute left-[17.5%] bottom-[47%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[2]}</p>
      </div>
      <div className="absolute left-[22%] top-[20%] w-[10%] h-[10%] flex justify-center z-20">
        <p className="text-center">{dates[3]}</p>
      </div>
      <div className="absolute right-[22.5%] top-[25%] w-[10%] h-[10%] flex justify-center z-20">
        <p className="text-center">{dates[4]}</p>
      </div>
      <div className="absolute right-[18%] bottom-[42%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[5]}</p>
      </div>
      <div className="absolute right-[13%] bottom-[17%] w-[10%] h-[10%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[6]}</p>
      </div>
      <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center z-20">
        <p className="text-center">{dates[7]}</p>
      </div>
    </div>
  );
};

export default MainDiagramContent;
