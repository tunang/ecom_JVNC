import type { Book } from './book.type';

export interface OrderItem {
  bookId: number;
  quantity: number;
  price: number;
  book?: Book; // For display purposes
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  address: string;
}

export interface Order {
  id: number;
  orderItems: OrderItem[];
  address: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  userId?: number;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
