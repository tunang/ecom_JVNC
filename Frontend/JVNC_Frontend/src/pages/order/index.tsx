import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  ShoppingBag,
  AlertCircle,
  Phone,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { RootState } from "@/store";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/order.type";
import { formatDate, formatPrice } from "@/lib/utils";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format price function

  // Format date function

  // Get status info (color, icon, text)
  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          text: "Chờ xác nhận",
          description: "Đơn hàng đang chờ được xác nhận",
        };
      case "CONFIRMED":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: CheckCircle,
          text: "Đã xác nhận",
          description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
        };
      case "SHIPPING":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Truck,
          text: "Đang giao hàng",
          description: "Đơn hàng đang trên đường giao đến bạn",
        };
      case "DELIVERED":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          text: "Đã giao hàng",
          description: "Đơn hàng đã được giao thành công",
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          text: "Đã hủy",
          description: "Đơn hàng đã bị hủy",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Package,
          text: status,
          description: "Trạng thái không xác định",
        };
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const fetchedOrders = await orderService.getAllOrders();
      setOrders(fetchedOrders || []);

      // Show success message if redirected from checkout
      if (location.state?.orderCreated) {
        toast.success("Đơn hàng đã được tạo thành công!");
        // Clear the state to prevent showing message on refresh
        window.history.replaceState({}, document.title);
      }
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Handle view order details
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập để xem đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem lịch sử đơn hàng của mình.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/login")} className="w-full">
              Đăng nhập
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Theo dõi và quản lý đơn hàng của bạn
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-300 rounded"></div>
                      <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời và
              đặt hàng ngay!
            </p>
            <Button onClick={() => navigate("/")} size="lg" className="px-8">
              <Package className="h-5 w-5 mr-2" />
              Bắt đầu mua sắm
            </Button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            Đơn hàng #{order.orderId}
                          </h3>
                          <Badge className={`${statusInfo.color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{order.orderItems.length} sản phẩm</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Items Preview */}
                    <div className="space-y-3">
                      {order.orderItems.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0">
                            {item.book?.imageUrl && (
                              <img
                                src={item.book.imageUrl}
                                alt={item.book.title || "Product"}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200";
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {item.book?.title ||
                                `Sản phẩm ID: ${item.bookId}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.book?.author &&
                                `Tác giả: ${item.book.author}`}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                Số lượng: {item.quantity}
                              </span>
                              <span className="text-sm font-medium text-blue-600">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {order.orderItems.length > 2 && (
                        <p className="text-sm text-gray-600 text-center py-2">
                          và {order.orderItems.length - 2} sản phẩm khác...
                        </p>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="flex flex-col items-start gap-2 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">
                                {order.address.length > 50
                                  ? `${order.address.substring(0, 50)}...`
                                  : order.address}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4" />
                              <span className="line-clamp-1">
                                {order.phone}
                              </span>
                            </div>
                      </div>

                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>

                          
                          
                        </DialogTrigger>

                        {selectedOrder && (
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <Package className="w-5 h-5" />
                                Chi tiết đơn hàng #{selectedOrder.id}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Order Status */}
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <StatusIcon
                                    className={`w-6 h-6 ${
                                      statusInfo.color.includes("yellow")
                                        ? "text-yellow-600"
                                        : statusInfo.color.includes("blue")
                                        ? "text-blue-600"
                                        : statusInfo.color.includes("purple")
                                        ? "text-purple-600"
                                        : statusInfo.color.includes("green")
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-semibold">
                                      {statusInfo.text}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {statusInfo.description}
                                    </p>
                                  </div>
                                </div>
                                <Badge className={`${statusInfo.color} border`}>
                                  {statusInfo.text}
                                </Badge>
                              </div>

                              {/* Order Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">
                                    Thông tin đơn hàng
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Mã đơn hàng:
                                      </span>
                                      <span className="font-medium">
                                        #{selectedOrder.id}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Ngày đặt:
                                      </span>
                                      <span>
                                        {formatDate(selectedOrder.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Tổng tiền:
                                      </span>
                                      <span className="font-bold text-blue-600">
                                        {formatPrice(selectedOrder.totalAmount)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-3">
                                    Địa chỉ giao hàng
                                  </h4>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                                      <p className="text-sm">
                                        {selectedOrder.address}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold mb-4">
                                  Sản phẩm đã đặt
                                </h4>
                                <div className="space-y-4">
                                  {selectedOrder.orderItems.map(
                                    (item, index) => (
                                      <div
                                        key={index}
                                        className="flex gap-4 p-4 border rounded-lg"
                                      >
                                        <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0">
                                          {item.book?.imageUrl && (
                                            <img
                                              src={item.book.imageUrl}
                                              alt={item.book.title || "Product"}
                                              className="w-full h-full object-cover rounded"
                                              onError={(e) => {
                                                const target =
                                                  e.target as HTMLImageElement;
                                                target.src =
                                                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200";
                                              }}
                                            />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <h5 className="font-medium text-gray-900 mb-1">
                                            {item.book?.title ||
                                              `Sản phẩm ID: ${item.bookId}`}
                                          </h5>
                                          {item.book?.author && (
                                            <p className="text-sm text-gray-600 mb-2">
                                              Tác giả: {item.book.author}
                                            </p>
                                          )}
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                              <span className="text-sm text-gray-600">
                                                Số lượng: {item.quantity}
                                              </span>
                                              <span className="text-sm text-gray-600">
                                                Đơn giá:{" "}
                                                {formatPrice(item.price)}
                                              </span>
                                            </div>
                                            <span className="font-semibold text-blue-600">
                                              {formatPrice(
                                                item.price * item.quantity
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const paymentUrl = order.paymentUrl;
                              window.open(paymentUrl, "_blank");
                            }}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Thanh toán
                          </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
