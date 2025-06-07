"use client"

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Order } from "@/types/order.type";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import OrderModal, { FormSchema } from "./order-modal";
import { orderService } from "@/services/order.service";
import type { z } from "zod";
import { formatPrice } from "@/lib/utils";

const DeleteAction: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <DeleteDialog
      title="Xóa"
      onConfirm={async () => {
        try {
          await orderService.deleteOrder(order.id);
          toast.success('Xóa đơn hàng thành công!');
          window.location.reload(); // Simple refresh for now
        } catch (error) {
          toast.error('Xóa đơn hàng thất bại!');
        }
      }}
    />
  );
};

const EditAction: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Sửa</Button>
      </DialogTrigger>
      <OrderModal
        modalProps={{
          mode: 'edit',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              await orderService.updateOrder(order.id, data);
              toast.success('Cập nhật đơn hàng thành công!');
              window.location.reload(); // Simple refresh for now
            } catch (error) {
              toast.error('Cập nhật đơn hàng thất bại!');
            }
          },
        }}
        order={order}
      />
    </Dialog>
  );
};

// Get status badge
const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ xác nhận</Badge>;
    case 'CONFIRMED':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Đã xác nhận</Badge>;
    case 'SHIPPING':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Đang giao hàng</Badge>;
    case 'DELIVERED':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Đã giao hàng</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    size: 80,
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    size: 100,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => getStatusBadge(row.original.status),
    size: 140,
  },
  {
    accessorKey: "orderItems",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const items = row.original.orderItems;
      if (!items || items.length === 0) return "Không có sản phẩm";
      
      return (
        <div className="max-w-[200px]">
          <span className="text-sm font-medium">{items.length} sản phẩm</span>
          <div className="text-xs text-gray-500 mt-1">
            {items.slice(0, 2).map((item, index) => (
              <div key={index}>
                {item.book?.title || `ID: ${item.bookId}`} (x{item.quantity})
              </div>
            ))}
            {items.length > 2 && (
              <div>và {items.length - 2} sản phẩm khác...</div>
            )}
          </div>
        </div>
      );
    },
    size: 250,
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng tiền" />
    ),
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      return (
        <span className="font-medium text-blue-600">
          {formatPrice(amount)}
        </span>
      );
    },
    size: 150,
  },
  {
    accessorKey: "address",
    header: "Địa chỉ giao hàng",
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="max-w-[200px]">
          <span className="text-sm">
            {address.length > 50 ? `${address.substring(0, 50)}...` : address}
          </span>
        </div>
      );
    },
    size: 220,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm">
          {date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      );
    },
    size: 160,
  },
  {
    accessorKey: 'edit-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <EditAction order={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: 'delete-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <DeleteAction order={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
]; 