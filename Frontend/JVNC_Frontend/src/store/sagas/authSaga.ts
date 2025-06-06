import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  initializeAuth,
  setAuthUser,
  logoutSuccess,
  logoutFailure,
  logoutRequest,
} from '../slices/authSlice';
import { fetchCartItemsRequest } from '../slices/cartSlice';
import { api } from '../../services/api.service';
import { ApiConstant } from '@/constants/api.constant';

// Types for API responses
interface LoginResponse {
  user: any;
  token: string;
}

interface RegisterResponse {
  user: any;
  token: string;
}

// Authentication initialization saga
function* initializeAuthSaga(): SagaIterator {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to fetch current user data to validate the token
      const user: any = yield call(api.get, '/users/me');
      yield put(setAuthUser(user));
      
      // Fetch cart items after successful auth initialization
      yield put(fetchCartItemsRequest());
    }
  } catch (error: any) {
    // If token is invalid, remove it
    localStorage.removeItem('token');
    yield put(loginFailure('Token không hợp lệ'));
  }
}

// Login saga
function* loginSaga(action: PayloadAction<{ email: string; password: string }>): SagaIterator {
  try {
    const { email, password } = action.payload;
    
    const response: LoginResponse = yield call(api.post, ApiConstant.auth.login,  {
      email,
      password,
    });

    // Store token in localStorage
    localStorage.setItem('token', response.token);

    yield put(loginSuccess({
      user: response.user,
      token: response.token,
    }));

    // Fetch cart items after successful login
    yield put(fetchCartItemsRequest());
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại'));
  }
}

// Register saga
function* registerSaga(action: PayloadAction<{ email: string; name: string; phone: string; password: string; otp: string }>): SagaIterator {
  try {
    const { email, name, phone, password, otp } = action.payload;
    
    const response: RegisterResponse = yield call(api.post, '/users/register', {
      registerRequest: {
        email,
        name,
        phone,
        password,
      },
      otp,
    });

    // Store token in localStorage
    localStorage.setItem('token', response.token);

    yield put(registerSuccess({
      user: response.user,
      token: response.token,
    }));

    // Fetch cart items after successful registration
    yield put(fetchCartItemsRequest());
  } catch (error: any) {
    yield put(registerFailure(error.response?.data?.message || 'Đăng ký thất bại'));
  }
}

// Send OTP saga
function* sendOtpSaga(action: PayloadAction<{ email: string }>): SagaIterator {
  try {
    const { email } = action.payload;
    
    yield call(api.post, '/users/send-otp', { email });

    yield put(sendOtpSuccess());
  } catch (error: any) {
    yield put(sendOtpFailure(error.response?.data?.message || 'Gửi OTP thất bại'));
  }
}

function* logoutSaga(): SagaIterator {
  try {
    yield call(api.post, ApiConstant.auth.logout);
    localStorage.removeItem('token');
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure(error.response?.data?.message || 'Đăng xuất thất bại'));
  }
}

// Root auth saga
export function* authSaga(): SagaIterator {
  yield takeLatest(initializeAuth.type, initializeAuthSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(sendOtpRequest.type, sendOtpSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
} 