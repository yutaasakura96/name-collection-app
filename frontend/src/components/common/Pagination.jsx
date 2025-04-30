import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, isFirst, isLast }) => {
  // Calculate range of pages to show
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="join">
      <button
        className="join-item btn btn-sm"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </button>

      {getPageRange().map((page) => (
        <button
          key={page}
          className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </button>
      ))}

      <button
        className="join-item btn btn-sm"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
