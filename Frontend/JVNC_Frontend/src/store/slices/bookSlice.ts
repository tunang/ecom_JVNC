import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

interface BookState {
  books: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;
  totalBooks: number;
  currentPage: number;
  pageSize: number;
}

const initialState: BookState = {
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  totalBooks: 0,
  currentPage: 1,
  pageSize: 10,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    // Fetch books actions
    fetchBooksRequest: (state, action: PayloadAction<{ page?: number; size?: number; search?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBooksSuccess: (state, action: PayloadAction<{ books: Book[]; total: number; page: number }>) => {
      state.isLoading = false;
      state.books = action.payload.books;
      state.totalBooks = action.payload.total;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    fetchBooksFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single book actions
    fetchBookByIdRequest: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBookByIdSuccess: (state, action: PayloadAction<Book>) => {
      state.isLoading = false;
      state.currentBook = action.payload;
      state.error = null;
    },
    fetchBookByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create book actions (Admin only)
    createBookRequest: (state, action: PayloadAction<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>) => {
      state.isLoading = true;
      state.error = null;
    },
    createBookSuccess: (state, action: PayloadAction<Book>) => {
      state.isLoading = false;
      state.books.unshift(action.payload);
      state.error = null;
    },
    createBookFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update book actions (Admin only)
    updateBookRequest: (state, action: PayloadAction<{ id: number; book: Partial<Book> }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateBookSuccess: (state, action: PayloadAction<Book>) => {
      state.isLoading = false;
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
      if (state.currentBook?.id === action.payload.id) {
        state.currentBook = action.payload;
      }
      state.error = null;
    },
    updateBookFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete book actions (Admin only)
    deleteBookRequest: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteBookSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.books = state.books.filter(book => book.id !== action.payload);
      if (state.currentBook?.id === action.payload) {
        state.currentBook = null;
      }
      state.error = null;
    },
    deleteBookFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current book
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
  },
});

export const {
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksFailure,
  fetchBookByIdRequest,
  fetchBookByIdSuccess,
  fetchBookByIdFailure,
  createBookRequest,
  createBookSuccess,
  createBookFailure,
  updateBookRequest,
  updateBookSuccess,
  updateBookFailure,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailure,
  clearError,
  clearCurrentBook,
} = bookSlice.actions;

export default bookSlice.reducer;
export type { Book }; 