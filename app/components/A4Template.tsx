const A4Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[210mm] h-[297mm] border border-gray-300 mx-auto mt-10 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full text-center bg-gray-300 z-10 py-4 mt-4">
        <div className="flex justify-between mx-4">
          <p>1. Jahrsiebt</p>
        <h2 className="text-xl font-bold text-gray-700">Urheber Schutz </h2>
        <p>Sylvia Regina Weyand</p>

        </div>
      </div>
      {children}
    </div>
  );
};

export default A4Template;
