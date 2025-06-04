import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from './bookSlice';

interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  userId: number;
  createdAt: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Fetch cart items actions
    fetchCartItemsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCartItemsSuccess: (state, action: PayloadAction<CartItem[]>) => {
      state.isLoading = false;
      state.items = action.payload;
      state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = action.payload.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      state.error = null;
    },
    fetchCartItemsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Add item to cart actions
    addToCartRequest: (state, action: PayloadAction<{ bookId: number; quantity: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action: PayloadAction<CartItem>) => {
      state.isLoading = false;
      const existingItem = state.items.find(item => item.book.id === action.payload.book.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      state.error = null;
    },
    addToCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update cart item quantity actions
    updateCartItemRequest: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action: PayloadAction<CartItem>) => {
      state.isLoading = false;
      const index = state.items.findIndex(item => item.id === action.payload.id);
      
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      state.error = null;
    },
    updateCartItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Remove item from cart actions
    removeFromCartRequest: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      state.error = null;
    },
    removeFromCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear entire cart actions
    clearCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.isLoading = false;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.error = null;
    },
    clearCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Local cart actions (for immediate UI updates)
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0);
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  incrementQuantity,
  decrementQuantity,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
export type { CartItem }; 