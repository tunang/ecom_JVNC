import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCartItemsRequest,
  fetchCartItemsSuccess,
  fetchCartItemsFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemRequest,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
} from '../slices/cartSlice';
import { api } from '../../services/api.service';
import type { SagaIterator } from 'redux-saga';

// Fetch cart items saga
function* fetchCartItemsSaga():SagaIterator {
  try {
    const response: any = yield call(api.get, '/api/cart-items');

    yield put(fetchCartItemsSuccess(response));
  } catch (error: any) {
    yield put(fetchCartItemsFailure(error.response?.data?.message || 'Lỗi khi tải giỏ hàng'));
  }
}

// Add to cart saga
function* addToCartSaga(action: PayloadAction<{ bookId: number; quantity: number }>):SagaIterator {
  try {
    const { bookId, quantity } = action.payload;
    
    const response: any = yield call(api.post, '/api/cart-items', {
      bookId,
      quantity,
    });

    yield put(addToCartSuccess(response));
  } catch (error: any) {
    yield put(addToCartFailure(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng'));
  }
}

// Update cart item saga
function* updateCartItemSaga(action: PayloadAction<{ itemId: number; quantity: number }>):SagaIterator {
  try {
    const { itemId, quantity } = action.payload;
    
    const response: any = yield call(api.put, `/api/cart-items/${itemId}`, {
      quantity,
    });

    yield put(updateCartItemSuccess(response));
  } catch (error: any) {
    yield put(updateCartItemFailure(error.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng'));
  }
}

// Remove from cart saga
function* removeFromCartSaga(action: PayloadAction<number>):SagaIterator {
  try {
    const itemId = action.payload;
    
    yield call(api.delete, `/api/cart-items/${itemId}`);

    yield put(removeFromCartSuccess(itemId));
  } catch (error: any) {
    yield put(removeFromCartFailure(error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng'));
  }
}

// Clear cart saga
function* clearCartSaga():SagaIterator {
  try {
    yield call(api.delete, '/api/cart-items');

    yield put(clearCartSuccess());
  } catch (error: any) {
    yield put(clearCartFailure(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng'));
  }
}

// Root cart saga
export function* cartSaga(): SagaIterator {
  yield takeLatest(fetchCartItemsRequest.type, fetchCartItemsSaga);
  yield takeLatest(addToCartRequest.type, addToCartSaga);
  yield takeLatest(updateCartItemRequest.type, updateCartItemSaga);
  yield takeLatest(removeFromCartRequest.type, removeFromCartSaga);
  yield takeLatest(clearCartRequest.type, clearCartSaga);
} 