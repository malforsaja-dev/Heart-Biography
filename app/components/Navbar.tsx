
"use client"

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div
        className={`fixed top-0 left-0 z-40 flex flex-col items-center border-r-4 border-orange-300 bg-orange-200 text-black h-screen transition-all duration-300 ease-in-out ${
          isHovered ? 'w-48' : 'w-20 md:w-20'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-lg md:text-2xl font-bold mt-4">
          {isHovered && <span className='mt-16 text-blue-700'>
            <Link href="/"> Heartthink</Link></span>}
          {!isHovered && <span>❤️</span>}
        </div>

        <nav className="flex flex-col mt-20 space-y-20">
          <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/lebensplan">
            <span>📈</span>
            {isHovered && <span className="ml-2">Lp Welle</span>}
          </Link>
          <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/seiten-page">
            <span>📝</span>
            {isHovered && <span className="ml-2">Seiten</span>}
          </Link>
          <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/print">
            <span>🖨️</span>
            {isHovered && <span className="ml-2">Print</span>}
          </Link>
          <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/about">
            <span>🅰️</span>
            {isHovered && <span className="ml-2">About</span>}
          </Link>
        </nav>
      </div>


      <div className="fixed top-0 right-0 z-30 flex justify-end items-center w-full border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4 space-x-4">
        <div className="relative">
          <button onClick={toggleDropdown} className="hover:text-blue-400 flex items-center button-3d">
            <span>🚩</span>
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 bg-white text-black rounded shadow-md py-2">
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">English</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Deutsch</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Español</a>
              </div>
            )}
          </button>
        </div>

        <button className="hover:text-blue-400 button-3d">
          <span className='bg-blue-200 rounded-full px-2 py-1'>S</span>
        </button>

        <button className="hover:text-blue-400 button-3d">
          <span>⚙️</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;