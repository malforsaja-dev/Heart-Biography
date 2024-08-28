"use client"

import { useState } from 'react';
import useDiagramDates from '../hooks/useDiagramDates';
import { useLanguage } from '../context/LanguageContext';

const LpWelle = () => {
  const [diagramIndex, setDiagramIndex] = useState(0);
  const { dates, maxDiagrams } = useDiagramDates(diagramIndex);
  const { texts } = useLanguage();

  // Ensure the currentPageTexts is fetched correctly from the JSON file
  const currentPageTexts = texts?.lpwelle?.[diagramIndex + 1];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Pagination bullets at the top */}
      <div className="flex justify-center items-center py-2 z-20 relative bg-gray-100">
        {Array.from({ length: maxDiagrams }).map((_, index) => (
          <button
            key={index}
            onClick={() => setDiagramIndex(index)}
            aria-label={`Go to diagram ${index + 1}`}
            className={`w-4 h-4 rounded-full mx-1 ${
              diagramIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="h-[8rem] bg-gray-300 flex justify-between items-center px-4 pb-4">
        <div className="flex flex-col text-left">
          <p className="text-lg font-bold">{texts?.lpwelle?.lebensplan}</p>
          <p className="text-lg">{`${diagramIndex + 1}. ${texts?.lpwelle?.jahrsiebt}`}</p>
        </div>
        <div className="flex flex-col text-right">
          <p>{currentPageTexts?.line1}</p>
          <p>{currentPageTexts?.line2}</p>
          <p>{currentPageTexts?.line3}</p>
          <p>{currentPageTexts?.line4}</p>
        </div>
      </div>

      <div className="relative h-[calc(100vh-17.5rem)] overflow-hidden">
        {/* Background gradient sections */}
        <div className="absolute top-0 left-0 w-full h-1/4 bg-yellow-200"></div>
        <div className="absolute top-1/4 left-0 w-full h-1/4 bg-pink-200"></div>
        <div className="absolute top-1/2 left-0 w-full h-1/4 bg-green-200"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-blue-200"></div>
  
        {/* Main diagram content */}
        <div className="absolute left-[5%] bottom-[9%] w-[40%] h-[10%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text1}</p>
        </div>
        <div className="absolute left-[1%] bottom-[1%] w-[1%] h-[5%] flex flex-col justify-center">
          <p className="text-center">{dates[0]}</p>
        </div>
        <div className="absolute left-[5%] bottom-[29%] w-[45%] h-[20%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text2}</p>
        </div>
        <div className="absolute left-[13%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
          <p className="text-center">{dates[1]}</p>
        </div>
        <div className="absolute left-[5%] bottom-[57%] w-[45%] h-[15%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text3}</p>
        </div>
        <div className="absolute left-[17.5%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
          <p className="text-center">{dates[2]}</p>
        </div>
        <div className="absolute left-[25%] top-[5%] w-[50%] h-[15%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text4}</p>
        </div>
        <div className="absolute left-[22%] top-[22%] w-[10%] h-[10%] flex justify-center">
          <p className="text-center">{dates[3]}</p>
        </div>
        <div className="absolute right-[23%] top-[22%] w-[10%] h-[10%] flex justify-center">
          <p className="text-center">{dates[4]}</p>
        </div>
        <div className="absolute right-[5%] bottom-[57%] w-[44%] h-[15%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text5}</p>
        </div>
        <div className="absolute right-[19%] bottom-[46%] w-[10%] h-[10%] flex flex-col justify-center">
          <p className="text-center">{dates[5]}</p>
        </div>
        <div className="absolute right-[5%] bottom-[33%] w-[44%] h-[15%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text6}</p>
        </div>
        <div className="absolute right-[14%] bottom-[21%] w-[10%] h-[10%] flex flex-col justify-center">
          <p className="text-center">{dates[6]}</p>
        </div>
        <div className="absolute right-[5%] bottom-[8%] w-[44%] h-[15%] flex flex-col justify-center">
          <p className="text-center">{texts?.lpwelle?.text7}</p>
        </div>
        <div className="absolute right-0 bottom-[1%] w-[10%] h-[5%] flex flex-col justify-center">
          <p className="text-center">{dates[7]}</p>
        </div>
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 3000 1325"
          preserveAspectRatio="none"
        >
          <g
            transform="translate(0.000000,1460.000000) scale(1.000000,-1.000000)"
            fill="#0077b6"
            stroke="none"
          >
            <path d="M1311 1445 c-190 -42 -347 -173 -453 -381 -44 -87 -61 -132 -128
              -339 -34 -105 -101 -246 -144 -305 -41 -55 -127 -139 -175 -172 -24 -17 -81
              -46 -127 -64 -76 -31 -93 -34 -184 -34 -55 0 -100 -4 -100 -9 0 -14 44 -17
              146 -9 78 5 103 12 185 50 210 98 335 270 440 603 28 88 71 201 95 250 135
              277 331 405 617 405 199 -1 334 -54 462 -184 118 -120 176 -234 265 -520 97
              -314 253 -499 485 -577 74 -25 101 -29 195 -29 61 0 110 4 110 9 0 4 -55 11
              -122 13 -173 8 -280 49 -397 154 -112 101 -185 234 -271 493 -62 189 -94 262
              -153 354 -73 114 -183 210 -292 257 -111 48 -320 64 -454 35z" />
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div className="relative flex justify-between items-center bg-gray-200 py-4 px-8 mt-auto">
        <p>{texts?.lpwelle?.bottomTextLeft}</p>
        <p>{texts?.lpwelle?.bottomTextCenter}</p>
        <p className="text-sm text-center">{texts?.lpwelle?.copyright}</p>
      </div>
    </div>
  );
};

export default LpWelle;
