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
} from '../slices/authSlice';
import { api } from '../../services/api.service';

// Types for API responses
interface LoginResponse {
  user: any;
  token: string;
}

interface RegisterResponse {
  user: any;
  token: string;
}

// Login saga
function* loginSaga(action: PayloadAction<{ email: string; password: string }>): SagaIterator {
  try {
    console.log(import.meta.env.VITE_API_BASE_URL)
    const { email, password } = action.payload;
    
    const response: LoginResponse = yield call(api.post, '/users/login', {
      email,
      password,
    });

    // Store token in localStorage
    localStorage.setItem('token', response.token);

    yield put(loginSuccess({
      user: response.user,
      token: response.token,
    }));
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại'));
  }
}

// Register saga
function* registerSaga(action: PayloadAction<{ email: string; name: string; phone: string; password: string; otp: string }>): SagaIterator {
  try {
    const { email, name, phone, password, otp } = action.payload;
    
    const response: RegisterResponse = yield call(api.post, '/api/users/register', {
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
  } catch (error: any) {
    yield put(registerFailure(error.response?.data?.message || 'Đăng ký thất bại'));
  }
}

// Send OTP saga
function* sendOtpSaga(action: PayloadAction<{ email: string }>): SagaIterator {
  try {
    const { email } = action.payload;
    
    yield call(api.post, '/api/users/send-otp', { email });

    yield put(sendOtpSuccess());
  } catch (error: any) {
    yield put(sendOtpFailure(error.response?.data?.message || 'Gửi OTP thất bại'));
  }
}

// Root auth saga
export function* authSaga(): SagaIterator {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(sendOtpRequest.type, sendOtpSaga);
} 