import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from '../slices/userSlice';
import { api } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';

// Fetch users saga
function* fetchUsersSaga(action: PayloadAction<{ page?: number; size?: number; search?: string }>):SagaIterator {
  try {
    const { page = 1, size = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/api/users', {
      params: { page, size, search },
    });

    yield put(fetchUsersSuccess({
      users: response.data || response,
      total: response.total || response.length,
      page: response.page || page,
    }));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng'));
  }
}

// Fetch user by ID saga
function* fetchUserByIdSaga(action: PayloadAction<number>):SagaIterator {
  try {
    const userId = action.payload;
    
    const response: any = yield call(api.get, `/api/users/${userId}`);

    yield put(fetchUserByIdSuccess(response));
  } catch (error: any) {
    yield put(fetchUserByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng'));
  }
}

// Update user saga
  function* updateUserSaga(action: PayloadAction<{ id: number; user: any }>):SagaIterator {
  try {
    const { id, user } = action.payload;
    
    const response: any = yield call(api.put, `/api/users/${id}`, user);

    yield put(updateUserSuccess(response));
  } catch (error: any) {
    yield put(updateUserFailure(error.response?.data?.message || 'Lỗi khi cập nhật người dùng'));
  }
}

// Delete user saga
function* deleteUserSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const userId = action.payload;
    
    yield call(api.delete, `/api/users/${userId}`);

    yield put(deleteUserSuccess(userId));
  } catch (error: any) {
    yield put(deleteUserFailure(error.response?.data?.message || 'Lỗi khi xóa người dùng'));
  }
}

// Root user saga
export function* userSaga(): SagaIterator {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
  yield takeLatest(deleteUserRequest.type, deleteUserSaga);
} 