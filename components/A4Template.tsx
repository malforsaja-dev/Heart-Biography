const A4Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[210mm] h-[297mm] border border-gray-300 mx-auto bg-white relative overflow-hidden backface-hidden">
      <div className="absolute top-0 left-0 w-full text-center bg-orange-300 z-10 py-4">
        <div className="flex justify-between mx-4 items-center">
          <div className="flex items-center">
            <p className="text-3xl text-white mr-4">40</p>
            <p>Thema & Titel</p>
          </div>
          <p>Sylvia Regina Weyand</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default A4Template;
