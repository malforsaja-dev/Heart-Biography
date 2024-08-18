
const A4Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[210mm] h-[297mm] border border-gray-300 mx-auto mt-10 bg-white relative overflow-hidden">
      {children}
    </div>
  );
};

export default A4Template;
