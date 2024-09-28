interface A4PortraitProps {
  children: React.ReactNode;
}

const A4Portrait: React.FC<A4PortraitProps> = ({ children }) => {
  return (
    <div className="a4-portrait-container mx-auto relative">
      {children}
    </div>
  );
};