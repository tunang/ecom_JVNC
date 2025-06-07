import { api } from './api.service';
import { ApiConstant } from '@/constants/api.constant';
import type { CreateOrderRequest, Order, OrderListResponse } from '@/types/order.type';

export const orderService = {
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post(ApiConstant.order.create, orderData);
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get(ApiConstant.order.getAll);
    return response.data || response; // Handle different response structures
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await api.get(ApiConstant.order.getById.replace(':id', orderId.toString()));
    return response.data || response;
  },

  // Admin functions
  getAllOrdersAdmin: async (): Promise<Order[]> => {
    const response = await api.get(ApiConstant.order.getAll);
    return response.data || response;
  },

  updateOrder: async (orderId: number, orderData: Partial<Order>): Promise<Order> => {
    const response = await api.put(ApiConstant.order.getById.replace(':id', orderId.toString()), orderData);
    return response.data || response;
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    await api.delete(ApiConstant.order.getById.replace(':id', orderId.toString()));
  },
}; 