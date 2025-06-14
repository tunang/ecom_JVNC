import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, AlertCircle, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { RootState } from '@/store';
import { orderService } from '@/services/order.service';
import type { CreateOrderRequest } from '@/types/order.type';
import { clearCartRequest, clearCartSuccess } from '@/store/slices/cartSlice';
import { ApiConstant } from '@/constants/api.constant';
import { api } from '@/services/api.service';
import { formatPrice } from '@/lib/utils';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, totalItems } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data according to API request body
      const orderData: CreateOrderRequest = {
        orderItems: items.map(item => ({
          bookId: item.book.bookId,
          quantity: item.quantity,
          price: item.book.price
        })),
        address: address.trim(),
        phone: phone.trim()
      };

      // Create order via API
      const createdOrder = await api.post(ApiConstant.order.create, orderData);
      
      // Clear cart on successful order
      dispatch(clearCartRequest());
      
      toast.success('Đặt hàng thành công!');
      
      // Navigate to order confirmation or orders list
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Order creation failed:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập để đặt hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để thực hiện đặt hàng.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full"
            >
              Đăng nhập
            </Button>
            <Button 
              onClick={() => navigate('/cart')} 
              variant="outline" 
              className="w-full"
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-6">
            Không có sản phẩm nào để đặt hàng.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Tiếp tục mua sắm
            </Button>
            <Button 
              onClick={() => navigate('/cart')} 
              variant="outline" 
              className="w-full"
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate shipping
  const freeShippingThreshold = 150000;
  const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/cart')}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại giỏ hàng
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Thanh toán
            </h1>
            <p className="text-gray-600">
              Xác nhận thông tin và hoàn tất đơn hàng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className='mb-2' htmlFor="address">Địa chỉ chi tiết *</Label>
                  <Textarea
                    id="address"
                    placeholder="Nhập địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)..."
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) {
                        setErrors({ ...errors, address: '' });
                      }
                    }}
                    className={`min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className='mb-2' htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${errors.phone ? 'border-red-500' : ''} `}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm đặt hàng ({totalItems} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {item.book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Tác giả: {item.book.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                              {item.book.genre?.name || 'Chưa phân loại'}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Số lượng: {item.quantity}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {formatPrice(item.book.price)} x {item.quantity}
                            </p>
                            <p className="font-semibold text-blue-600">
                              {formatPrice(item.book.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>

                {/* Free shipping achieved */}
                {totalPrice >= freeShippingThreshold && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Bạn được miễn phí vận chuyển!</span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                </div>

                {/* Place Order Button */}
                <Button 
                  onClick={handleSubmitOrder}
                  className="w-full h-12 text-lg font-semibold"
                  disabled={isLoading || !address.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Đặt hàng'
                  )}
                </Button>

                {/* Benefits */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Bảo hành chất lượng 100%</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Giao hàng nhanh toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span>Đổi trả dễ dàng trong 7 ngày</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Checkout;