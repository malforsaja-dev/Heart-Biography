interface PaginationProps {
  maxPapers: number;
  currentPage: number;
  handlePaperNavigation: (index: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ maxPapers, currentPage, handlePaperNavigation }) => {
  return (
    <div className="flex justify-center items-center py-2 bg-gray-100">
      {Array.from({ length: maxPapers }).map((_, index: number) => (
        <button
          key={index}
          onClick={() => handlePaperNavigation(index)}
          className={`w-4 h-4 rounded-full mx-1 ${currentPage === index * 2 ? 'bg-blue-500' : 'bg-gray-300'}`}
          aria-label={`Go to paper ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default Pagination;
