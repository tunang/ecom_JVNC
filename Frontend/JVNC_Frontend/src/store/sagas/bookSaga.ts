import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
  fetchBooksByGenreSuccess,
  fetchBooksByGenreFailure,
  fetchBooksByGenreRequest,
} from '../slices/bookSlice';
import { api, apiDefaultUpload } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';

// Fetch books saga
function* fetchBooksSaga(action: PayloadAction<{ page?: number; size?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, size = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/books');
    console.log(response);
    
    yield put(fetchBooksSuccess({
      books: response.data || response,
      total: response.total || response.length,
      page: response.page || page,
    }));
  } catch (error: any) {
    yield put(fetchBooksFailure(error.response?.data?.message || 'Lỗi khi tải danh sách sách'));
  }
}

// Fetch book by ID saga
function* fetchBookByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const bookId = action.payload;
    
    const response: any = yield call(api.get, `/books/${bookId}`);
    yield put(fetchBookByIdSuccess(response));
  } catch (error: any) {
    yield put(fetchBookByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin sách'));
  }
}
function* fetchBooksByGenreSaga(action: PayloadAction<{ genreId: number }>): SagaIterator {
  try {
    const { genreId } = action.payload;
    
    const response: any = yield call(api.get, `/books/genre/${genreId}`);
    console.log(response);
    yield put(fetchBooksByGenreSuccess(response));
  } catch (error: any) {
    yield put(fetchBooksByGenreFailure(error.response?.data?.message || 'Lỗi khi tải danh sách sách'));
  }
}

// Create book saga
function* createBookSaga(action: PayloadAction<any>): SagaIterator {
  try {
    const bookData = action.payload;
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add book fields to FormData
    if (bookData.title) formData.append('title', bookData.title);
    if (bookData.author) formData.append('author', bookData.author);
    if (bookData.description) formData.append('description', bookData.description);
    if (bookData.price) formData.append('price', bookData.price.toString());
    if (bookData.stock) formData.append('stock', bookData.stock.toString());
    if (bookData.genreId) formData.append('genreId', bookData.genreId.toString());
    
    // Handle cover image
    if (bookData.coverImage && bookData.coverImage instanceof File) {
      formData.append('coverImage', bookData.coverImage);
    }
    
    const response: any = yield call(apiDefaultUpload.post, '/books', formData);
    yield put(createBookSuccess(response.data));
  } catch (error: any) {
    yield put(createBookFailure(error.response?.data?.message || 'Lỗi khi tạo sách'));
  }
}

// Update book saga
function* updateBookSaga(action: PayloadAction<{ id: number; book: any }>): SagaIterator {
  try {
    const { id, book } = action.payload;
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add book fields to FormData
    if (book.title) formData.append('title', book.title);
    if (book.author) formData.append('author', book.author);
    if (book.description) formData.append('description', book.description);
    if (book.price) formData.append('price', book.price.toString());
    if (book.stock) formData.append('stock', book.stock.toString());
    if (book.genreId) formData.append('genreId', book.genreId.toString());
    
    // Handle cover image if there's a new one
    if (book.coverImage && book.coverImage instanceof File) {
      formData.append('coverImage', book.coverImage);
    }
    
    const response: any = yield call(apiDefaultUpload.put, `/books/${id}`, formData);
    yield put(updateBookSuccess(response.data));
  } catch (error: any) {
    yield put(updateBookFailure(error.response?.data?.message || 'Lỗi khi cập nhật sách'));
  }
}

// Delete book saga
function* deleteBookSaga(action: PayloadAction<{ bookId: number }>): SagaIterator {
  try {
    const { bookId } = action.payload;
    
    yield call(api.delete, `/books/${bookId}`);
    yield put(deleteBookSuccess(bookId));
  } catch (error: any) {
    yield put(deleteBookFailure(error.response?.data?.message || 'Lỗi khi xóa sách'));
  }
}

// Root book saga
export function* bookSaga(): SagaIterator {
  yield takeLatest(fetchBooksRequest.type, fetchBooksSaga);
  yield takeLatest(fetchBookByIdRequest.type, fetchBookByIdSaga);
  yield takeLatest(createBookRequest.type, createBookSaga);
  yield takeLatest(updateBookRequest.type, updateBookSaga);
  yield takeLatest(deleteBookRequest.type, deleteBookSaga); 
  yield takeLatest(fetchBooksByGenreRequest.type, fetchBooksByGenreSaga);
} 