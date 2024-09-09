import A4Portrait from '@/components/fotobook/A4Portrait';
import DraggableResizableBox from '@/components/fotobook/DraggableResizableBox';

interface PaperProps {
  currentPage: number;
  isFrontSide: boolean;
  startDate: string;
  endDate: string;
  elementsFront: any[];
  elementsBack: any[];
  updateElement: (id: number, data: { x?: number; y?: number; width?: number; height?: number }) => void;
  removeElement: (id: number) => void;
}

const Paper: React.FC<PaperProps> = ({
  currentPage, isFrontSide, startDate, endDate, elementsFront, elementsBack, updateElement, removeElement
}) => {
  return (
    <div
      className={`relative w-full h-full transition-transform duration-700`}
      style={{
        transform: isFrontSide ? 'rotateY(0deg)' : 'rotateY(180deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {currentPage === 0 && (
        <A4Portrait pageNumber={1} showHeader={false}>
          <p>Mein Lebensplan</p>
          <p>HeartThink</p>
          <p>Beruf mensch</p>
        </A4Portrait>
      )}

      {currentPage === 2 && (
        <>
          <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
            <A4Portrait pageNumber={2} showHeader={false}>
              <p>HeartThink - Beruf Mensch</p>
              <p>(eine Serie von Büchern zur Selbst-Entwicklung)</p>
              <br />
              <p>Mein Lebensplan</p>
              <p>Sylvia Weyand</p>
              <p>unter Mitarbeit von Florin Lowndes</p>
            </A4Portrait>
          </div>

          <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <A4Portrait pageNumber={3} showHeader={false}>
              <p>INHALT</p>
              <p>Fotobuch ...................................... 6</p>
              <p>Lebensplan Wellen Biographie ... 40</p>
            </A4Portrait>
          </div>
        </>
      )}

      {currentPage >= 4 && (
        <>
          <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
            <A4Portrait pageNumber={currentPage} startDate={startDate} endDate={endDate} showHeader={true}>
              {elementsFront.filter((element) => element.pageNumber === currentPage).map((element) => (
                <DraggableResizableBox
                  key={element.id}
                  id={element.id}
                  content={element.content}
                  defaultWidth={element.defaultWidth}
                  defaultHeight={element.defaultHeight}
                  initialPosition={{ x: element.x, y: element.y }}
                  onRemove={removeElement}
                  onPositionChange={(id, position) => updateElement(id, { x: position.x, y: position.y })}
                  onSizeChange={(id, size) => updateElement(id, { width: size.width, height: size.height })}
                  type={element.type}
                />
              ))}
            </A4Portrait>
          </div>

          <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <A4Portrait pageNumber={currentPage + 1} startDate={startDate} endDate={endDate} showHeader={true}>
              {elementsBack.filter((element) => element.pageNumber === currentPage + 1).map((element) => (
                <DraggableResizableBox
                  key={element.id}
                  id={element.id}
                  content={element.content}
                  defaultWidth={element.defaultWidth}
                  defaultHeight={element.defaultHeight}
                  initialPosition={{ x: element.x, y: element.y }}
                  onRemove={removeElement}
                  onPositionChange={(id, position) => updateElement(id, { x: position.x, y: position.y })}
                  onSizeChange={(id, size) => updateElement(id, { width: size.width, height: size.height })}
                  type={element.type}
                />
              ))}
            </A4Portrait>
          </div>
        </>
      )}
    </div>
  );
};

export default Paper;
