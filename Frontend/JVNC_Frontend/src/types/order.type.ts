import type { Book } from './book.type';
import type { User } from './user.type';

export interface OrderItem {
  bookId: number;
  quantity: number;
  price: number;
  book?: Book; // For display purposes
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  address: string;
  phone: string;
}

export interface Order {
  id: number;
  orderId?: string;
  orderItems: OrderItem[];
  address: string;
  phone: string;
  paymentUrl: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  userId?: number;
  user?: User;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
