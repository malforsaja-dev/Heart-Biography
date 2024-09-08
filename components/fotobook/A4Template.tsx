import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

interface A4TemplateProps {
  children: React.ReactNode;
  pageNumber: number;
  showHeader: boolean;
  startDate?: string;
  endDate?: string;
}

const colors = [
  "#b2bee9", //for paper 2 will not displayed
  "#92d4ee", //here starts paper 3 - 1. jahrsiebt
  "#b3e2a0",
  "#ec86b9",
  "#f8d24a",
  "#f8d24a",
  "#f8d24a",
  "#f3b5d4",
  "#d1edc3",
  "#bde5f5",
  "#bde5f5",
  "#d1edc3",
  "#f3b5d4",

];

const A4TemplateProps: React.FC<A4TemplateProps> = ({ children, pageNumber, showHeader, startDate, endDate }) => {
  const { texts } = useLanguage();
  const { user } = useUser();
  
  // Paper 3 starts from page 5
  const jahrsiebtIndex = Math.floor((pageNumber - 4) / 2) + 1; 
  const jahrsiebt = texts.fotobook?.jahrsiebt;
  const planet = texts.fotobook?.planet[jahrsiebtIndex];
  const userName = `${user?.first_name} ${user?.last_name}`;

  let headerContent;
  
  if (jahrsiebtIndex <= 12) {
    headerContent = (
      <>
        <p>{`${jahrsiebtIndex}. ${jahrsiebt}`}</p>
        <p>• {startDate} - {endDate}</p>
        <p>• {planet}</p>
      </>
    );
  } else {
    headerContent = <p>{texts.fotobook?.customTitle}</p>;
  }

  return (
    <div className="a4-container border border-gray-300 mx-auto bg-white relative overflow-hidden backface-hidden">
      {showHeader && (
        <div
        className="absolute top-0 left-0 w-full text-center z-10 py-4"
        style={{
          backgroundColor: colors[jahrsiebtIndex % colors.length],
        }}
      >
        <div className="flex justify-between mx-4 items-center">
          <div className="flex items-center gap-2">
            <p className="text-3xl text-white mr-2">{pageNumber}</p>
            {headerContent}
          </div>
          <p>{userName}</p>
        </div>
      </div>
      )}
      {children}
    </div>
  );
};


export default A4TemplateProps;
