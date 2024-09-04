"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import useClickOutside from '@/hooks/useClickOutside';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Navbar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { texts, changeLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initials, setInitials] = useState<string | null>(null);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userDetails, error } = await supabase
          .from('lpwelle')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
  
        if (!error && userDetails) {
          setInitials(`${userDetails.first_name[0]}${userDetails.last_name[0]}`);
        }
      }
    };
    getUserData();
  }, []);

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

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <div>
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50 ${
          isHovered ? 'w-48' : 'w-16'
        } bg-orange-200 border-r-4 border-orange-300`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col items-center h-full mt-16">
          <div className="text-lg md:text-2xl font-bold">
            <span className=" text-blue-700">
              {isHovered ? (
                <Link href="/"> {texts.navbar?.home || 'HeartThink'}</Link>
              ) : (
                <span>❤️</span>
              )}
            </span>
          </div>

          <nav className="flex flex-col mt-20 space-y-20 ">
            <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/lebensplan">
              <span>📈</span>
              {isHovered && <span className="ml-2">{texts.navbar?.lpWelle || 'Plan'}</span>}
            </Link>
            <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/seiten-page">
              <span>📝</span>
              {isHovered && <span className="ml-2">{texts.navbar?.pages || 'Pages'}</span>}
            </Link>
            <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/print">
              <span>🖨️</span>
              {isHovered && <span className="ml-2">{texts.navbar?.print || 'Print'}</span>}
            </Link>
            <Link className="text-blue-600 hover:text-blue-400 flex items-center button-3d" href="/about">
              <span>🅰️</span>
              {isHovered && <span className="ml-2">{texts.navbar?.about || 'About'}</span>}
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-red-600 hover:text-red-400 flex items-center button-3d mt-4"
            >
              <span>🚪</span>
              {isHovered && <span className="ml-2">Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      <div className="fixed top-0 right-0 z-20 flex justify-end items-center w-full border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4 space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="hover:text-blue-400 flex items-center button-3d">
            <span>🚩</span>
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 bg-orange-200 text-black rounded shadow-md py-2">
                <a href="#" onClick={() => changeLanguage('en')} className="block px-4 py-2 hover:bg-orange-300">
                  {texts.dropdown?.english || 'English'}
                </a>
                <a href="#" onClick={() => changeLanguage('de')} className="block px-4 py-2 hover:bg-orange-300">
                  {texts.dropdown?.german || 'Deutsch'}
                </a>
                <a href="#" onClick={() => changeLanguage('es')} className="block px-4 py-2 hover:bg-orange-300">
                  {texts.dropdown?.spanish || 'Español'}
                </a>
              </div>
            )}
          </button>
        </div>

        {initials && (
          <button className="hover:text-blue-400 button-3d">
            <span className="bg-blue-200 rounded-full px-2 py-1">{initials}</span>
          </button>
        )}

        <button className="hover:text-blue-400 button-3d">
          <span>⚙️</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
