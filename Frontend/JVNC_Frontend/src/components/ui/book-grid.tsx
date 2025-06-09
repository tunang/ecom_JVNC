import React from 'react';
import BookCard from './book-card';
import type { Book } from '@/types/book.type';

interface BookGridProps {
  books: Book[];
  onAddToCart?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  favoriteBooks?: number[];
  className?: string;
  loading?: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  onAddToCart,
  onToggleFavorite,
  favoriteBooks = [],
  className = "",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy sách nào
        </h3>
        <p className="text-gray-500 max-w-md">
          Hiện tại không có sách nào trong danh mục này. Vui lòng quay lại sau hoặc thử tìm kiếm với từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 ${className}`}>
      {books.map((book) => (
        <BookCard
          key={book.bookId}
          book={book}
          // onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteBooks.includes(book.bookId)}
        />
      ))}
    </div>
  );
};

export default BookGrid; 