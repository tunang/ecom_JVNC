# Redux Store Structure

This folder contains the Redux Toolkit + Redux Saga setup for state management.

## Folder Structure

```
src/store/
├── index.ts                 # Main store configuration
├── hooks.ts                 # Typed Redux hooks
├── slices/                  # RTK slices (state management)
│   ├── authSlice.ts         # Authentication state
│   ├── userSlice.ts         # User management state
│   ├── bookSlice.ts         # Book management state
│   └── cartSlice.ts         # Shopping cart state
├── sagas/                   # Redux Saga side effects
│   ├── authSaga.ts          # Authentication API calls
│   ├── userSaga.ts          # User management API calls
│   ├── bookSaga.ts          # Book management API calls
│   └── cartSaga.ts          # Cart management API calls
└── README.md                # This file
```

## Usage Examples

### 1. Using in Components

Instead of the standard Redux hooks, use the typed hooks:

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

### 2. Login Example

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginRequest, clearError } from '../store/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogin = (email: string, password: string) => {
    dispatch(loginRequest({ email, password }));
  };

  return (
    // Your JSX here
  );
};
```

### 3. Cart Example

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartRequest, fetchCartItemsRequest } from '../store/slices/cartSlice';

const CartComponent = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPrice, isLoading } = useAppSelector(state => state.cart);

  const addToCart = (bookId: number, quantity: number) => {
    dispatch(addToCartRequest({ bookId, quantity }));
  };

  useEffect(() => {
    dispatch(fetchCartItemsRequest());
  }, [dispatch]);

  return (
    // Your JSX here
  );
};
```

### 4. Books Example

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooksRequest, createBookRequest } from '../store/slices/bookSlice';

const BooksComponent = () => {
  const dispatch = useAppDispatch();
  const { books, isLoading, error, currentPage, totalBooks } = useAppSelector(state => state.book);

  useEffect(() => {
    dispatch(fetchBooksRequest({ page: 1, size: 10 }));
  }, [dispatch]);

  const createBook = (bookData: any) => {
    dispatch(createBookRequest(bookData));
  };

  return (
    // Your JSX here
  );
};
```

## Available Actions

### Authentication (authSlice)
- `loginRequest({ email, password })`
- `registerRequest({ email, name, phone, password, otp })`
- `sendOtpRequest({ email })`
- `logout()`
- `clearError()`

### Books (bookSlice)
- `fetchBooksRequest({ page?, size?, search? })`
- `fetchBookByIdRequest(id)`
- `createBookRequest(bookData)` (Admin only)
- `updateBookRequest({ id, book })` (Admin only)
- `deleteBookRequest(id)` (Admin only)

### Cart (cartSlice)
- `fetchCartItemsRequest()`
- `addToCartRequest({ bookId, quantity })`
- `updateCartItemRequest({ itemId, quantity })`
- `removeFromCartRequest(itemId)`
- `clearCartRequest()`
- `incrementQuantity(itemId)` (local state only)
- `decrementQuantity(itemId)` (local state only)

### Users (userSlice) - Admin only
- `fetchUsersRequest({ page?, size?, search? })`
- `fetchUserByIdRequest(id)`
- `updateUserRequest({ id, user })`
- `deleteUserRequest(id)`

## State Structure

Each slice follows a similar pattern:

```typescript
interface SliceState {
  data: DataType[];
  currentItem: DataType | null;
  isLoading: boolean;
  error: string | null;
  // Additional specific fields
}
```

## Error Handling

All API calls are handled by sagas and will automatically:
- Set loading states
- Handle success/failure
- Store errors in the state
- Show appropriate error messages

## Token Management

The auth saga automatically:
- Stores JWT tokens in localStorage
- Includes tokens in API headers via interceptors
- Handles token expiration
- Redirects to login on 401 errors 