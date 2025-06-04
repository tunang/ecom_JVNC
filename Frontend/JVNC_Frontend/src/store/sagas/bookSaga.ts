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
} from '../slices/bookSlice';
import { api } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';

// Fetch books saga
function* fetchBooksSaga(action: PayloadAction<{ page?: number; size?: number; search?: string }>) :SagaIterator  {
  try {
    const { page = 1, size = 10, search = '' } = action.payload;
    
    const response = yield call(api.get, '/api/books', {
      params: { page, size, search },
    });

    yield put(fetchBooksSuccess({
      books: response.data,
      total: response.total,
      page: response.page,
    }));
  } catch (error: any) {
    yield put(fetchBooksFailure(error.response?.data?.message || 'Lỗi khi tải danh sách sách'));
  }
}

// Fetch book by ID saga
function* fetchBookByIdSaga(action: PayloadAction<number>):SagaIterator {
  try {
    const bookId = action.payload;
    
    const response = yield call(api.get, `/api/books/${bookId}`);

    yield put(fetchBookByIdSuccess(response));
  } catch (error: any) {
    yield put(fetchBookByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin sách'));
  }
}

// Create book saga
function* createBookSaga(action: PayloadAction<any>):SagaIterator {
  try {
    const bookData = action.payload;
    
    const response = yield call(api.post, '/api/books', bookData);

    yield put(createBookSuccess(response));
  } catch (error: any) {
    yield put(createBookFailure(error.response?.data?.message || 'Lỗi khi tạo sách mới'));
  }
}

// Update book saga
function* updateBookSaga(action: PayloadAction<{ id: number; book: any }>):SagaIterator {
  try {
    const { id, book } = action.payload;
    
    const response = yield call(api.put, `/api/books/${id}`, book);

    yield put(updateBookSuccess(response));
  } catch (error: any) {
    yield put(updateBookFailure(error.response?.data?.message || 'Lỗi khi cập nhật sách'));
  }
}

// Delete book saga
function* deleteBookSaga(action: PayloadAction<number>):SagaIterator {
  try {
    const bookId = action.payload;
    
    yield call(api.delete, `/api/books/${bookId}`);

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
} 