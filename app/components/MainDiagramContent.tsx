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
  const editableText1 = useEditableText(texts.text1 || '');
  const editableText2 = useEditableText(texts.text2 || '');
  const editableText3 = useEditableText(texts.text3 || '');
  const editableText4 = useEditableText(texts.text4 || '');
  const editableText5 = useEditableText(texts.text5 || '');
  const editableText6 = useEditableText(texts.text6 || '');
  const editableText7 = useEditableText(texts.text7 || '');

  return (
    <div className="relative h-[calc(100vh-16.5rem)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200"></div>
      <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200"></div>
      <div className="absolute left-[5%] bottom-[9%] w-[40%] h-[10%] flex flex-col justify-center">
        {editableText1.isEditing ? editableText1.renderEditor() : <p className="text-center" onClick={editableText1.toggleEditMode}>{editableText1.text}</p>}
      </div>
      <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center">
        <p className="text-center">{dates[0]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[29%] w-[45%] h-[20%] flex flex-col justify-center">
        {editableText2.isEditing ? editableText2.renderEditor() : <p className="text-center" onClick={editableText2.toggleEditMode}>{editableText2.text}</p>}
      </div>
      <div className="absolute left-[13%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[1]}</p>
      </div>
      <div className="absolute left-[5%] bottom-[57%] w-[45%] h-[15%] flex flex-col justify-center">
        {editableText3.isEditing ? editableText3.renderEditor() : <p className="text-center" onClick={editableText3.toggleEditMode}>{editableText3.text}</p>}
      </div>
      <div className="absolute left-[17.5%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[2]}</p>
      </div>
      <div className="absolute left-[25%] top-[5%] w-[50%] h-[15%] flex flex-col justify-center">
        {editableText4.isEditing ? editableText4.renderEditor() : <p className="text-center" onClick={editableText4.toggleEditMode}>{editableText4.text}</p>}
      </div>
      <div className="absolute left-[22%] top-[22%] w-[10%] h-[10%] flex justify-center">
        <p className="text-center">{dates[3]}</p>
      </div>
      <div className="absolute right-[23%] top-[22%] w-[10%] h-[10%] flex justify-center">
        <p className="text-center">{dates[4]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[57%] w-[44%] h-[15%] flex flex-col justify-center">
        {editableText5.isEditing ? editableText5.renderEditor() : <p className="text-center" onClick={editableText5.toggleEditMode}>{editableText5.text}</p>}
      </div>
      <div className="absolute right-[19%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[5]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[33%] w-[44%] h-[15%] flex flex-col justify-center">
        {editableText6.isEditing ? editableText6.renderEditor() : <p className="text-center" onClick={editableText6.toggleEditMode}>{editableText6.text}</p>}
      </div>
      <div className="absolute right-[14%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
        <p className="text-center">{dates[6]}</p>
      </div>
      <div className="absolute right-[5%] bottom-[8%] w-[44%] h-[15%] flex flex-col justify-center">
        {editableText7.isEditing ? editableText7.renderEditor() : <p className="text-center" onClick={editableText7.toggleEditMode}>{editableText7.text}</p>}
      </div>
      <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center">
        <p className="text-center">{dates[7]}</p>
      </div>
    </div>
  );
};

export default MainDiagramContent;
