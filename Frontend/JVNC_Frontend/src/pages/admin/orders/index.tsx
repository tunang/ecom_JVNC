import TablePage from "@/components/ui/data-table";
import { columns } from "./columns";
import type { Order } from "@/types/order.type";
import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const fetchedOrders = await orderService.getAllOrdersAdmin();
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container w-full">
      <TablePage 
        columns={columns} 
        data={orders} 
        title="Quản lý đơn hàng" 
        loading={isLoading}
        hasToolbar={true}
        hasPagination={true}
      />
    </div>
  );
};

export default Orders;