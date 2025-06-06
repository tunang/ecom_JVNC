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
}; 