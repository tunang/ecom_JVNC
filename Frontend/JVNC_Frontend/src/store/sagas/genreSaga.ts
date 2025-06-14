import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from '../slices/genreSlice';
import { api } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';

// Fetch genres saga
function* fetchGenresSaga(action: PayloadAction<{ page?: number; size?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, size = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/genres');
    console.log(response);
    
    yield put(fetchGenresSuccess({
      genres: response.data || response,
      total: response.total || response.length,
      page: response.page || page,
    }));
  } catch (error: any) {
    yield put(fetchGenresFailure(error.response?.data?.message || 'Lỗi khi tải danh sách thể loại'));
  }
}

// Fetch genre by ID saga
function* fetchGenreByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const genreId = action.payload;
    
    const response: any = yield call(api.get, `/genres/${genreId}`);
    yield put(fetchGenreByIdSuccess(response));
  } catch (error: any) {
    yield put(fetchGenreByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin thể loại'));
  }
}

// Create genre saga
function* createGenreSaga(action: PayloadAction<{ name: string }>): SagaIterator {
  try {
    const { name } = action.payload;
    
    const response: any = yield call(api.post, '/genres', { name });
    yield put(createGenreSuccess(response));
  } catch (error: any) {
    yield put(createGenreFailure(error.response?.data?.message || 'Lỗi khi tạo thể loại'));
  }
}

// Update genre saga
function* updateGenreSaga(action: PayloadAction<{ id: number; genre: any }>): SagaIterator {
  try {
    const { id, genre } = action.payload;
    
    const response: any = yield call(api.put, `/genres/${id}`, { name: genre.name });
    yield put(updateGenreSuccess(response));
  } catch (error: any) {
    yield put(updateGenreFailure(error.response?.data?.message || 'Lỗi khi cập nhật thể loại'));
  }
}

// Delete genre saga
function* deleteGenreSaga(action: PayloadAction<{ genreId: number }>): SagaIterator {
  try {
    const { genreId } = action.payload;
    
    yield call(api.delete, `/genres/${genreId}`);
    yield put(deleteGenreSuccess(genreId));
  } catch (error: any) {
    yield put(deleteGenreFailure(error.response?.data?.message || 'Lỗi khi xóa thể loại'));
  }
}

// Root genre saga
export function* genreSaga(): SagaIterator {
  yield takeLatest(fetchGenresRequest.type, fetchGenresSaga);
  yield takeLatest(fetchGenreByIdRequest.type, fetchGenreByIdSaga);
  yield takeLatest(createGenreRequest.type, createGenreSaga);
  yield takeLatest(updateGenreRequest.type, updateGenreSaga);
  yield takeLatest(deleteGenreRequest.type, deleteGenreSaga);
}
