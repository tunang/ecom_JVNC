import React, { useState } from 'react';
import BookGrid from '@/components/ui/book-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Book } from '@/types/book.type';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Sample books data for demonstration
const sampleBooks: Book[] = [
  {
    bookId: 1,
    title: "Số đỏ",
    author: "Vũ Trọng Phụng",
    description: "Tiểu thuyết nổi tiếng về cuộc sống của tầng lớp tiểu tư sản Hà Nội những năm 1930",
    price: 120000,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    genre: { genreId: 1, name: "Tiểu thuyết" },
    createdAt: "2024-01-01"
  },
  {
    bookId: 2,
    title: "Doraemon - Tập 1",
    author: "Fujiko F. Fujio",
    description: "Manga nổi tiếng về chú mèo máy đến từ tương lai",
    price: 25000,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    genre: { genreId: 2, name: "Truyện tranh" },
    createdAt: "2024-01-01"
  },
  {
    bookId: 3,
    title: "Dune - Hành tinh cát",
    author: "Frank Herbert",
    description: "Tiểu thuyết khoa học viễn tưởng kinh điển",
    price: 280000,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
    genre: { genreId: 3, name: "Khoa học viễn tưởng" },
    createdAt: "2024-01-01"
  },
  {
    bookId: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "Tiểu thuyết lãng mạn kinh điển về Elizabeth và Darcy",
    price: 175000,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    genre: { genreId: 4, name: "Lãng mạn" },
    createdAt: "2024-01-01"
  },
  {
    bookId: 5,
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    description: "Tuyển tập truyện trinh thám kinh điển",
    price: 200000,
    stock: 0, // Out of stock to test
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    genre: { genreId: 5, name: "Trinh thám" },
    createdAt: "2024-01-01"
  },
  {
    bookId: 6,
    title: "The Shining",
    author: "Stephen King",
    description: "Tiểu thuyết kinh dị về khách sạn ma ám",
    price: 190000,
    stock: 5, // Low stock to test
    imageUrl: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400",
    genre: { genreId: 6, name: "Kinh dị" },
    createdAt: "2024-01-01"
  }
];

const BooksShowcase: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [favoriteBooks, setFavoriteBooks] = useState<number[]>([1, 3]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(false);

  const handleAddToCart = (book: Book) => {
    toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`, {
      description: `Tác giả: ${book.author}`,
    });
  };

  const handleToggleFavorite = (book: Book) => {
    setFavoriteBooks(prev => {
      const isFavorite = prev.includes(book.bookId);
      if (isFavorite) {
        toast.success(`Đã xóa "${book.title}" khỏi danh sách yêu thích`);
        return prev.filter(id => id !== book.bookId);
      } else {
        toast.success(`Đã thêm "${book.title}" vào danh sách yêu thích`);
        return [...prev, book.bookId];
      }
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'author':
        return a.author.localeCompare(b.author);
      case 'genre':
        return a.genre.name.localeCompare(b.genre.name);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          BookCard Component Showcase
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Hiển thị thiết kế BookCard với các tính năng: hover effects, price formatting, stock status, và favorite functionality.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Sắp xếp theo tên</SelectItem>
              <SelectItem value="author">Sắp xếp theo tác giả</SelectItem>
              <SelectItem value="price-low">Giá: Thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá: Cao đến thấp</SelectItem>
              <SelectItem value="genre">Sắp xếp theo thể loại</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={toggleLoading} variant="outline">
            Test Loading
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📚 Tổng: {books.length} sách</span>
          <span>❤️ Yêu thích: {favoriteBooks.length} sách</span>
          <span>🔍 Hiển thị: {sortedBooks.length} sách</span>
        </div>
      </div>

      {/* Book Grid */}
      <BookGrid
        books={sortedBooks}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favoriteBooks={favoriteBooks}
        loading={loading}
        className="mb-8"
      />
 <div>
            <Card>
              <CardHeader>    
                <CardTitle>Đánh giá từ khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">4.0</div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">127 đánh giá</p>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    {/* Mock reviews */}
                    {[
                      { name: 'Nguyễn Văn A', rating: 5, comment: 'Sách rất hay, nội dung thú vị!' },
                      { name: 'Trần Thị B', rating: 4, comment: 'Giao hàng nhanh, chất lượng tốt.' },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-sm">{review.name}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      {/* Features Info */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          ✨ BookCard Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Responsive design (1-5 columns)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Smooth hover animations</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Vietnamese price formatting</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Stock status badges</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Favorite heart button</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Add to cart functionality</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Image error handling</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Genre and rating display</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Loading skeleton state</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksShowcase; 