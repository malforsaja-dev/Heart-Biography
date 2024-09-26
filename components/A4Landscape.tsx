import React from 'react';

interface A4LandscapeProps {
  children: React.ReactNode;
}

const A4Landscape: React.FC<A4LandscapeProps> = ({ children }) => {
  return (
    <div className="a4-landscape-container mx-auto relative">
      {children}
    </div>
  );
};

export default A4Landscape;