import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.type";

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  pageSize: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Fetch users actions (Admin only)
    fetchUsersRequest: (
      state,
      action: PayloadAction<{ page?: number; size?: number; search?: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (
      state,
      action: PayloadAction<{ users: User[]; total: number; page: number }>
    ) => {
      state.isLoading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single user actions
    fetchUserByIdRequest: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserByIdSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    fetchUserByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createUserRequest: (state, action: PayloadAction<{ user: Partial<User> }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.users.push(action.payload);
    },  
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Update user actions
    updateUserRequest: (
      state,
      action: PayloadAction<{ id: number; user: Partial<User> }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      const index = state.users.findIndex(
        (user) => user.userId === action.payload.userId
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.userId === action.payload.userId) {
        state.currentUser = action.payload;
      }
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete user actions (Admin only)
    deleteUserRequest: (state, action: PayloadAction<{ userId: number }>) => {
      console.log(action);
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.users = state.users.filter(
        (user) => user.userId !== action.payload
      );
      if (state.currentUser?.userId === action.payload) {
        state.currentUser = null;
      }
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current user
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
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
  clearError,
  clearCurrentUser,
} = userSlice.actions;

export default userSlice.reducer;
