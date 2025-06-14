import { api } from './api.service';
import { ApiConstant } from '@/constants/api.constant';
import type { Book } from '@/types/book.type';

export interface SearchBooksParams {
  title?: string;
  author?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export interface SearchBooksResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
}

export const bookService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get(ApiConstant.book.getAll);
    return response.data || response;
  },

  // Get book by ID
  getBookById: async (bookId: number): Promise<Book> => {
    const response = await api.get(ApiConstant.book.getByID.replace(':id', bookId.toString()));
    return response.data || response;
  },

  // Get books by genre
  getBooksByGenre: async (genreId: number): Promise<Book[]> => {
    const response = await api.get(ApiConstant.book.getByGenre.replace(':genreId', genreId.toString()));
    return response.data || response;
  },

  // Search books by title
  searchBooks: async (params: SearchBooksParams): Promise<Book[]> => {
    const searchParams = new URLSearchParams();
    
    if (params.title) {
      searchParams.append('title', params.title);
    }
    if (params.author) {
      searchParams.append('author', params.author);
    }
    if (params.genre) {
      searchParams.append('genre', params.genre);
    }
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const response = await api.get(`${ApiConstant.book.search}?${searchParams.toString()}`);
    return response.data || response;
  },
}; 