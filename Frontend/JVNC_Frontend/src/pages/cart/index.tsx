import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCartItemsRequest,
  updateCartItemRequest,
  removeFromCartRequest,
  clearCartRequest,
  incrementQuantity,
  decrementQuantity,
} from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Gift,
  AlertCircle,
  CheckCircle,
  Package,
  Heart,
  CheckLineIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { items, isLoading, totalItems, totalPrice, error } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItemsRequest());
    }
  }, [dispatch, isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number, currentQuantity: number) => {
    if (newQuantity === currentQuantity) return;
    
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
      return;
    }

    // Optimistic update for better UX
    if (newQuantity > currentQuantity) {
      dispatch(incrementQuantity(itemId));
    } else {
      dispatch(decrementQuantity(itemId));
    }

    // Make API call
    dispatch(updateCartItemRequest({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCartRequest(itemId));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    dispatch(clearCartRequest());
    toast.success('Đã xóa tất cả sản phẩm trong giỏ hàng');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập để xem giỏ hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem và quản lý giỏ hàng của mình.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full"
            >
              Đăng nhập
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline" 
              className="w-full"
            >
              Tạo tài khoản mới
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 bg-gray-300 rounded"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        <div className="h-8 w-32 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  <div className="h-20 w-full bg-gray-300 rounded"></div>
                  <div className="h-12 w-full bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </div>

          {/* Empty Cart */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm chúng vào giỏ hàng!
            </p>
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="px-8"
            >
              <Package className="h-5 w-5 mr-2" />
              Khám phá sản phẩm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate shipping (free for orders over 150k)
  const freeShippingThreshold = 150000;
  const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Giỏ hàng của bạn
              </h1>
              <p className="text-gray-600">
                {totalItems} sản phẩm trong giỏ hàng
              </p>
            </div>
          </div>
          
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            {totalPrice < freeShippingThreshold && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        Thêm {formatPrice(freeShippingThreshold - totalPrice)} để được miễn phí vận chuyển!
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(totalPrice / freeShippingThreshold) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                            alt={item.book.title}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => navigate(`/product/${item.book.bookId}`)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 
                              className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                              onClick={() => navigate(`/product/${item.book.bookId}`)}
                            >
                              {item.book.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Tác giả: {item.book.author}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {item.book.genre?.name || 'Chưa phân loại'}
                            </Badge>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">
                              {formatPrice(item.book.price)}
                            </p>
                            
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.quantity)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1 min-w-[40px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.quantity)}
                                disabled={item.quantity >= item.book.stock}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(item.book.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Thành tiền
                            </p>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.book.stock < 10 && (
                          <div className="flex items-center gap-2 mt-3 text-amber-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">
                              Chỉ còn {item.book.stock} sản phẩm trong kho
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
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

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg font-semibold"
                  disabled={items.length === 0}
                >
                  Đặt hàng
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
                    <Gift className="h-4 w-4 text-purple-600" />
                    <span>Đổi trả dễ dàng trong 7 ngày</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Cần thêm gì nữa không?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Khám phá thêm nhiều sản phẩm tuyệt vời
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;