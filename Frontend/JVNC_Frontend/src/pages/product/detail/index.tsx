import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookByIdRequest, fetchBooksByGenreRequest } from '@/store/slices/bookSlice';
import { addToCartRequest } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BookGrid from '@/components/ui/book-grid';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentBook: book, books: relatedBooks, isLoading } = useAppSelector((state) => state.book);
  const { isLoading: cartLoading } = useAppSelector((state) => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      dispatch(fetchBookByIdRequest(Number(productId)));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (book?.genre?.genreId) {
      dispatch(fetchBooksByGenreRequest({ genreId: book.genre.genreId }));
    }
  }, [dispatch, book?.genre?.genreId]);



  const handleAddToCart = () => {
    if (!book) return;
    
    dispatch(addToCartRequest({ bookId: book.bookId, quantity }));
    toast.success(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng!`);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép link sản phẩm!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="aspect-[3/4] bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-20 w-full bg-gray-300 rounded"></div>
                <div className="h-12 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sách</h2>
          <p className="text-gray-600 mb-4">Sách bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const getStockStatus = () => {
    if (book.stock === 0) return { text: 'Hết hàng', variant: 'destructive' as const, icon: AlertCircle };
    if (book.stock < 10) return { text: `Còn ${book.stock} cuốn`, variant: 'secondary' as const, icon: AlertCircle };
    return { text: 'Còn hàng', variant: 'default' as const, icon: CheckCircle };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  // Mock data for demonstration
  const relatedBooksFiltered = relatedBooks.filter(b => b.bookId !== book.bookId).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-0 h-auto hover:bg-transparent"
          >
            Trang chủ
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/genre/${book.genre.genreId}`)}
            className="p-0 h-auto hover:bg-transparent"
          >
            {book.genre.name}
          </Button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{book.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-lg">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                // onError={(e) => {
                //   const target = e.target as HTMLImageElement;
                //   target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';
                // }}
              />
            </div>
            {/* {book.imageUrl.length > 1 && (
              <div className="flex gap-2">
                {book.imageUrl.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${book.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )} */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Tác giả: <span className="font-semibold">{book.author}</span>
              </p>
              <div className="flex items-center gap-4">
                <Badge variant={stockStatus.variant} className="flex items-center gap-1">
                  <StockIcon className="h-4 w-4" />
                  {stockStatus.text}
                </Badge>
                <Badge variant="secondary">
                  {book.genre.name}
                </Badge>
              </div>
            </div>

            {/* Rating (Mock) */}
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.0)</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">127 đánh giá</span>
            </div> */}

            {/* Price */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(book.price)}
                  </p>
                  <p className="text-sm text-gray-600">Giá đã bao gồm VAT</p>
                </div>
                {/* <div className="text-right">
                  <p className="text-sm text-gray-600">Tiết kiệm</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(book.price * 0.1)}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= book.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {book.stock} sản phẩm có sẵn
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0 || cartLoading}
                  className="flex-1 h-12 text-lg font-semibold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="h-12 w-12"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="h-12 w-12"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium">Miễn phí vận chuyển</p>
                <p className="text-xs text-gray-600">Đơn từ 150k</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium">Bảo hành chất lượng</p>
                <p className="text-xs text-gray-600">Hoàn tiền 100%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <RefreshCw className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs font-medium">Đổi trả dễ dàng</p>
                <p className="text-xs text-gray-600">Trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Tác giả:</span>
                    <span className="ml-2 text-gray-600">{book.author}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Thể loại:</span>
                    <span className="ml-2 text-gray-600">{book.genre.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Tình trạng:</span>
                    <span className="ml-2 text-gray-600">{stockStatus.text}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Giá bán:</span>
                    <span className="ml-2 text-gray-600">{formatPrice(book.price)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
         
        </div>

        {/* Related Books */}
        {relatedBooksFiltered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Sách cùng thể loại
              </h2>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/genre/${book.genre.genreId}`)}
              >
                Xem tất cả
              </Button>
            </div>
            <BookGrid
              books={relatedBooksFiltered}
              onAddToCart={(book) => {
                dispatch(addToCartRequest({ bookId: book.bookId, quantity: 1 }));
                toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`);
              }}
              className="mb-8"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;