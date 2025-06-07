import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  Book, 
  Filter, 
  ArrowLeft, 
  X, 
  ShoppingCart,
  Star,
  Heart,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { RootState } from '@/store';
import { bookService } from '@/services/book.service';
import type { Book as BookType } from '@/types/book.type';
import { formatPrice } from '@/lib/utils';
import { addToCartRequest } from '@/store/slices/cartSlice';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('title') || '');
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'author'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounce search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await bookService.searchBooks({ title: query.trim() });
      setBooks(Array.isArray(results) ? results : []);
      
      // Update URL params
      setSearchParams({ title: query.trim() });
    } catch (error: any) {
      console.error('Search failed:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for search
  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    } else {
      setBooks([]);
      setSearchParams({});
    }
  }, [debouncedSearchQuery]);

  // Sort books
  const sortedBooks = React.useMemo(() => {
    const sorted = [...books].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'title':
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [books, sortBy, sortOrder]);

  // Handle add to cart
  const handleAddToCart = (book: BookType) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    dispatch(addToCartRequest({ bookId: book.bookId, quantity: 1 }));
    toast.success(`Đã thêm "${book.title}" vào giỏ hàng`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setBooks([]);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tìm kiếm sách
            </h1>
            <p className="text-gray-600">
              Khám phá thế giới sách phong phú
            </p>
          </div>
        </div>


        {/* Search Results Header */}
        {(searchQuery || books.length > 0) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Kết quả tìm kiếm'}
              </h2>
              <p className="text-gray-600">
                {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${books.length} kết quả`}
              </p>
            </div>

            {books.length > 0 && (
              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Tên sách</SelectItem>
                      <SelectItem value="author">Tác giả</SelectItem>
                      <SelectItem value="price">Giá</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-gray-300 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Book className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy kết quả
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Không tìm thấy sách nào với từ khóa "{searchQuery}". Hãy thử với từ khóa khác.
            </p>
            <Button onClick={clearSearch} variant="outline">
              Xóa tìm kiếm
            </Button>
          </div>
        )}

        {/* Search Results - Grid View */}
        {!isLoading && books.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <Card key={book.bookId} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  {/* Book Image */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    <img
                      src={book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${book.bookId}`)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';
                      }}
                    />
                    {book.stock < 10 && book.stock > 0 && (
                      <Badge className="absolute top-2 right-2 bg-amber-500">
                        Còn {book.stock}
                      </Badge>
                    )}
                    {book.stock === 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        Hết hàng
                      </Badge>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 
                        className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/product/${book.bookId}`)}
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Tác giả: {book.author}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {book.genre?.name || 'Chưa phân loại'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(book.price)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(book)}
                        disabled={book.stock === 0}
                        className="flex items-center gap-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {book.stock === 0 ? 'Hết hàng' : 'Thêm'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search Results - List View */}
        {!isLoading && books.length > 0 && viewMode === 'list' && (
          <div className="space-y-4">
            {sortedBooks.map((book) => (
              <Card key={book.bookId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                          alt={book.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigate(`/product/${book.bookId}`)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                          }}
                        />
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 
                            className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                            onClick={() => navigate(`/product/${book.bookId}`)}
                          >
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Tác giả: {book.author}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary">
                              {book.genre?.name || 'Chưa phân loại'}
                            </Badge>
                            {book.stock < 10 && book.stock > 0 && (
                              <Badge className="bg-amber-100 text-amber-800">
                                Còn {book.stock}
                              </Badge>
                            )}
                            {book.stock === 0 && (
                              <Badge className="bg-red-100 text-red-800">
                                Hết hàng
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-blue-600 mb-3">
                            {formatPrice(book.price)}
                          </p>
                          <Button
                            onClick={() => handleAddToCart(book)}
                            disabled={book.stock === 0}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                          </Button>
                        </div>
                      </div>

                      {/* Description Preview */}
                      {book.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mt-3">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - No Search Query */}
        {!searchQuery && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tìm kiếm sách yêu thích
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Nhập tên sách, tác giả hoặc từ khóa để tìm kiếm hàng ngàn cuốn sách phong phú.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 