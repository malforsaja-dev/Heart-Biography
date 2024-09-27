import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

interface A4PortraitProps {
  children: React.ReactNode;
  pageNumber: number;
  showHeader: boolean;
  startDate?: string;
  endDate?: string;
  isFrontSide?: boolean;
}

const colors = [
  "#c0ae84", //for paper 2 will not displayed
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

const customTexts = [
  "HERKUNFTSFAMILIEN",
  "VOM VÄTERCHEN HAB ICH DIE STATUR", 
  "FREUNDE", 
  "IN GRUPPEN", 
  "UNTERSTÜTZENDE MENSCHEN", 
  "ARBEITEN", 
  "RESIEN", 
  "LEBENSORTE", 
  "Menschen im Himmel", 
];

const A4Portrait: React.FC<A4PortraitProps> = ({ children, pageNumber, showHeader, startDate, endDate, isFrontSide }) => {
  const { texts } = useLanguage();
  const { user } = useUser();
  
  // Adjust index to account for the extra custom text page
  const adjustedPageNumber = pageNumber - 2;
  const jahrsiebtIndex = Math.floor((adjustedPageNumber - 4) / 2) + 1; 
  const customTextIndex = jahrsiebtIndex - 13;
  const jahrsiebt = texts.fotobook?.jahrsiebt;
  const planet = texts.fotobook?.planet[jahrsiebtIndex];
  const userName = `${user?.user_name}`;

  let headerContent;

  if (jahrsiebtIndex === 0) {
    // First page with custom text
    headerContent = isFrontSide ? (
      <div className='flex justify-between items-end'>
        <div className="flex items-end gap-2">
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
          <p>{customTexts[0]}</p>
        </div>
        <p className='text-xl italic'>{userName}</p>
      </div>
    ) : (
      <div className='flex justify-between items-end'>
        <p className='text-xl italic'>{userName}</p>
        <div className="flex items-end gap-2">
          <p>{customTexts[0]}</p>
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
        </div>
      </div>
    );
  } else if (jahrsiebtIndex <= 12) {
    // Pages with premade headers
    headerContent = isFrontSide ? (
      <div className='flex justify-between items-end'>
        <div className="flex items-end gap-2">
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
          <p>{`${jahrsiebtIndex}. ${jahrsiebt}`}</p>
          <p>• {startDate} - {endDate}</p>
          <p>• {planet}</p>
        </div>
        <p className='text-xl italic'>{userName}</p>
      </div>
    ) : (
      <div className='flex justify-between items-end'>
        <p className='text-xl italic'>{userName}</p>
        <div className="flex items-end gap-2">
          <p>{planet}</p>
          <p>• {startDate} - {endDate}</p>
          <p>• {`${jahrsiebtIndex}. ${jahrsiebt}`}</p>
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
        </div>
      </div>
    );
  } else {
    // Pages with custom texts after the 12th header
    headerContent = isFrontSide ? (
      <div className='flex justify-between items-end'>
        <div className="flex items-end gap-2">
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
          <p>{customTexts[customTextIndex]}</p>
        </div>
        <p className='text-xl italic'>{userName}</p>
      </div>
    ) : (
      <div className='flex justify-between items-end'>
        <p className='text-xl italic'>{userName}</p>
        <div className="flex items-end gap-2">
          <p>{customTexts[customTextIndex]}</p>
          <p className="text-3xl text-white mr-2">{pageNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="a4-container border border-gray-300 mx-auto bg-white relative overflow-hidden backface-hidden">
      {showHeader && (
        <div
          className="absolute top-0 left-0 w-full text-center z-10 p-4"
          style={{ backgroundColor: colors[jahrsiebtIndex % colors.length] }}
        >
          {headerContent}
        </div>
      )}
      {children}
    </div>
  );
};

export default A4Portrait;