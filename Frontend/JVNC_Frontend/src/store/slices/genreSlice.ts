import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Genre } from '../../types/genre.type';

interface GenreState {
  genres: Genre[];
  currentGenre: Genre | null;
  isLoading: boolean;
  error: string | null;
  totalGenres: number;
  currentPage: number;
  pageSize: number;
}

const initialState: GenreState = {
  genres: [],
  currentGenre: null,
  isLoading: false,
  error: null,
  totalGenres: 0,
  currentPage: 1,
  pageSize: 10,
};

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {
    // Fetch genres actions
    fetchGenresRequest: (state, action: PayloadAction<{ page?: number; size?: number; search?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGenresSuccess: (state, action: PayloadAction<{ genres: Genre[]; total: number; page: number }>) => {
      state.isLoading = false;
      state.genres = action.payload.genres;
      state.totalGenres = action.payload.total;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    fetchGenresFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single genre actions
    fetchGenreByIdRequest: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGenreByIdSuccess: (state, action: PayloadAction<Genre>) => {
      state.isLoading = false;
      state.currentGenre = action.payload;
      state.error = null;
    },
    fetchGenreByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create genre actions
    createGenreRequest: (state, action: PayloadAction<{ name: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createGenreSuccess: (state, action: PayloadAction<Genre>) => {
      state.isLoading = false;
      state.genres.unshift(action.payload);
      state.totalGenres += 1;
      state.error = null;
    },
    createGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update genre actions
    updateGenreRequest: (state, action: PayloadAction<{ id: number; genre: Partial<Genre> }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateGenreSuccess: (state, action: PayloadAction<Genre>) => {
      state.isLoading = false;
      const index = state.genres.findIndex(genre => genre.genreId === action.payload.genreId);
      if (index !== -1) {
        state.genres[index] = action.payload;
      }
      if (state.currentGenre?.genreId === action.payload.genreId) {
        state.currentGenre = action.payload;
      }
      state.error = null;
    },
    updateGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete genre actions
    deleteGenreRequest: (state, action: PayloadAction<{ genreId: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteGenreSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.genres = state.genres.filter(genre => genre.genreId !== action.payload);
      state.totalGenres -= 1;
      if (state.currentGenre?.genreId === action.payload) {
        state.currentGenre = null;
      }
      state.error = null;
    },
    deleteGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current genre
    clearCurrentGenre: (state) => {
      state.currentGenre = null;
    },
  },
});

export const {
  fetchGenresRequest,
  fetchGenresSuccess,
  fetchGenresFailure,
  fetchGenreByIdRequest,
  fetchGenreByIdSuccess,
  fetchGenreByIdFailure,
  createGenreRequest,
  createGenreSuccess,
  createGenreFailure,
  updateGenreRequest,
  updateGenreSuccess,
  updateGenreFailure,
  deleteGenreRequest,
  deleteGenreSuccess,
  deleteGenreFailure,
  clearError,
  clearCurrentGenre,
} = genreSlice.actions;

export default genreSlice.reducer;
