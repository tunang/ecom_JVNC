import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import bookReducer from './slices/bookSlice';
import cartReducer from './slices/cartSlice';
import genreReducer from './slices/genreSlice';

// Import sagas
import { authSaga } from './sagas/authSaga';
import { userSaga } from './sagas/userSaga';
import { bookSaga } from './sagas/bookSaga';
import { cartSaga } from './sagas/cartSaga';
import { genreSaga } from './sagas/genreSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga(): SagaIterator {
  yield all([
    fork(authSaga),
    fork(userSaga),
    fork(bookSaga),
    fork(cartSaga),
    fork(genreSaga),
  ]);
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    book: bookReducer,
    cart: cartReducer,
    genre: genreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 