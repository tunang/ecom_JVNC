import { FormMessage } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import type { Order } from "@/types/order.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface OrderModalProps {
  modalProps?: {
    mode: "read" | "create" | "edit";
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  order?: Order;
  onClose?: () => void;
}

export const FormSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'], {
    required_error: "Vui lòng chọn trạng thái đơn hàng.",
  }),
  address: z.string().min(10, {
    message: "Địa chỉ phải có ít nhất 10 ký tự.",
  }),
});

const OrderModal: React.FC<OrderModalProps> = ({ modalProps, order, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: order?.status || 'PENDING',
      address: order?.address || '',
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status,
        address: order.address,
      });
    }
  }, [order, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!modalProps?.onSubmit) return;

    try {
      setIsSubmitting(true);
      await modalProps.onSubmit(data);
      if (onClose) onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status info for display
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xác nhận' };
      case 'CONFIRMED':
        return { color: 'bg-blue-100 text-blue-800', text: 'Đã xác nhận' };
      case 'SHIPPING':
        return { color: 'bg-purple-100 text-purple-800', text: 'Đang giao hàng' };
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-800', text: 'Đã giao hàng' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', text: 'Đã hủy' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {modalProps?.mode === 'edit' ? 'Chỉnh sửa đơn hàng' : 'Chi tiết đơn hàng'} #{order?.id}
        </DialogTitle>
        <DialogDescription>
          {modalProps?.mode === 'edit' 
            ? 'Cập nhật thông tin trạng thái và địa chỉ giao hàng.'
            : 'Xem thông tin chi tiết đơn hàng.'
          }
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Information */}
        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-3">Thông tin đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium">{order.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-bold text-blue-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái hiện tại:</span>
                    <Badge className={getStatusInfo(order.status).color}>
                      {getStatusInfo(order.status).text}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3">Sản phẩm đã đặt ({order.orderItems.length} sản phẩm)</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0">
                        {item.book?.imageUrl && (
                          <img
                            src={item.book.imageUrl}
                            alt={item.book.title || 'Product'}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">
                          {item.book?.title || `Sản phẩm ID: ${item.bookId}`}
                        </h5>
                        {item.book?.author && (
                          <p className="text-xs text-gray-600">
                            Tác giả: {item.book.author}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">
                            Số lượng: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Edit Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <h4 className="font-semibold text-lg mb-3">
                    {modalProps?.mode === 'edit' ? 'Cập nhật thông tin' : 'Thông tin giao hàng'}
                  </h4>

                  {/* Status Field */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái đơn hàng</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={modalProps?.mode !== 'edit'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                            <SelectItem value="SHIPPING">Đang giao hàng</SelectItem>
                            <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address Field */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ giao hàng</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập địa chỉ giao hàng chi tiết..."
                            className="min-h-[100px]"
                            disabled={modalProps?.mode !== 'edit'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {modalProps?.mode === 'edit' && (
                    <DialogFooter className="gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isSubmitting}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang cập nhật...
                          </div>
                        ) : (
                          'Cập nhật đơn hàng'
                        )}
                      </Button>
                    </DialogFooter>
                  )}
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default OrderModal; 