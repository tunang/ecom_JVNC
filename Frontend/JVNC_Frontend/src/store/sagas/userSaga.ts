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
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from '../slices/userSlice';
import { setAuthUser } from '../slices/authSlice';
import { api, apiDefaultUpload } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';
import { ApiConstant } from '@/constants/api.constant';

// Fetch users saga
function* fetchUsersSaga(action: PayloadAction<{ page?: number; size?: number; search?: string }>):SagaIterator {
  try {
    const { page = 1, size = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, ApiConstant.user.getAll);
    console.log(response);
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


function* createUserSaga(action: PayloadAction<{ user: any }>): SagaIterator {
  try {
    const {  user } = action.payload;
    console.log(user);
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add user fields to FormData
    if (user.name) formData.append('name', user.name);
    if (user.phone) formData.append('phone', user.phone);
    if (user.password) formData.append('password', user.password);
    if (user.role) formData.append('role', user.role);

    // Handle profile picture
    if (user.profilePicture) {
      // If it's a base64 string, convert it to a blob
      if (typeof user.profilePicture === 'string' && user.profilePicture.startsWith('data:')) {
        const response = yield call(fetch, user.profilePicture);
        const blob: Blob = yield call([response, 'blob']);
        formData.append('profilePicture', blob, 'profile.jpg');
      }
    } else if (user.image && user.image instanceof File) {
      // If it's a File object, use it directly
      formData.append('profilePicture', user.image);
    }

    // Use the upload API service with FormData - Axios response
    const response: any = yield call(apiDefaultUpload.post, `/users/admin-create`, formData);
    
    // For Axios response, data is already parsed and available in response.data
    // Axios automatically throws errors for non-2xx status codes, so no need to check response.ok
    yield put(updateUserSuccess(response.data));
  } catch (error: any) {
    yield put(updateUserFailure(error.message || error.response?.data?.message || 'Lỗi khi cập nhật người dùng'));
  }
}
// Update user saga
function* updateUserSaga(action: PayloadAction<{ id: number; user: any }>): SagaIterator {
  try {
    const { id, user } = action.payload;
    console.log(user);
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add user fields to FormData
    if (user.name) formData.append('name', user.name);
    if (user.phone) formData.append('phone', user.phone);
    if (user.password) formData.append('password', user.password);
    if (user.role) formData.append('role', user.role);

    // Handle profile picture
    if (user.profilePicture) {
      // If it's a base64 string, convert it to a blob
      if (typeof user.profilePicture === 'string' && user.profilePicture.startsWith('data:')) {
        const response = yield call(fetch, user.profilePicture);
        const blob: Blob = yield call([response, 'blob']);
        formData.append('profilePicture', blob, 'profile.jpg');
      }
    } else if (user.image && user.image instanceof File) {
      // If it's a File object, use it directly
      formData.append('profilePicture', user.image);
    }

    // Use the upload API service with FormData - Axios response
    const response: any = yield call(apiDefaultUpload.put, `/users/${id}`, formData);
    
    // For Axios response, data is already parsed and available in response.data
    // Axios automatically throws errors for non-2xx status codes, so no need to check response.ok
    yield put(updateUserSuccess(response.data));
  } catch (error: any) {
    yield put(updateUserFailure(error.message || error.response?.data?.message || 'Lỗi khi cập nhật người dùng'));
  }
}

// Delete user saga
function* deleteUserSaga(action: PayloadAction<{userId: number}>): SagaIterator {
  try {
    const { userId } = action.payload;
    
    yield call(api.delete, `/users/${userId}`);

    yield put(deleteUserSuccess(userId));
  } catch (error: any) {
    yield put(deleteUserFailure(error.response?.data?.message || 'Lỗi khi xóa người dùng'));
  }
}

// Update profile saga (for authenticated user)
function* updateProfileSaga(action: PayloadAction<any>): SagaIterator {
  try {
    const user = action.payload;
    console.log('Updating profile:', user);
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add user fields to FormData
    if (user.name) formData.append('name', user.name);
    if (user.phone) formData.append('phone', user.phone);
    if (user.password) formData.append('password', user.password);

    // Handle profile picture
    if (user.profilePicture && user.profilePicture instanceof File) {
      // If it's a File object, use it directly
      formData.append('profilePicture', user.profilePicture);
    }

    // Use the upload API service with FormData - calls /users/me
    const response: any = yield call(apiDefaultUpload.put, `/users/me`, formData);
    
    // Update both user slice and auth slice
    yield put(updateProfileSuccess(response.data || response));
    yield put(setAuthUser(response.data || response));
  } catch (error: any) {
    yield put(updateProfileFailure(error.message || error.response?.data?.message || 'Lỗi khi cập nhật thông tin cá nhân'));
  }
}

// Root user saga
export function* userSaga(): SagaIterator {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
  yield takeLatest(deleteUserRequest.type, deleteUserSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
} 