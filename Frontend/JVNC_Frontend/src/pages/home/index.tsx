import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGenresRequest } from '@/store/slices/genreSlice';
import { fetchBooksRequest, type Book } from '@/store/slices/bookSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookCard from '@/components/ui/book-card';
import {
  ArrowRight,
  BookOpen,
  Star,
  TrendingUp,
  Users,
  Zap,
  Heart,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { genres, isLoading : isGenreLoading } = useAppSelector((state) => state.genre);
  const { books, isLoading : isBookLoading } = useAppSelector((state) => state.book);
  
  useEffect(() => {
    // Fetch genres and books on component mount
    dispatch(fetchGenresRequest({ page: 1, size: 20 }));
    dispatch(fetchBooksRequest({ page: 1, size: 20 }));
  }, [dispatch]);



  // Get featured books (first 8 books)
// NEW CODE:
const featuredBooks = Array.isArray(books) ? books.slice(0, 8) : [];
const popularBooks = Array.isArray(books) ? books.slice(8, 16) : [];

// Also update the booksByGenre logic:
const booksByGenre = Array.isArray(genres) && genres.reduce((acc, genre) => {
  const booksArray = Array.isArray(books) ? books : [];
  acc[genre.genreId] = booksArray.filter(book => book.genre?.genreId === genre.genreId).slice(0, 4);
  return acc;
}, {} as Record<number, typeof books>);



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <h1 className="text-5xl md:text-7xl font-bold">BookWorld</h1>
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </div>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Khám phá thế giới tri thức bất tận với hàng ngàn cuốn sách hay từ các thể loại đa dạng
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
              onClick={() => {
                const featuredSection = document.getElementById('featured');
                featuredSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Khám phá ngay
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              onClick={() => navigate('/cart')}
            >
              <Heart className="mr-2 h-5 w-5" />
              Xem giỏ hàng
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{books.length}+</div>
              <div className="text-gray-600">Cuốn sách</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-gray-600">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{genres.length}</div>
              <div className="text-gray-600">Thể loại</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-gray-600">Đánh giá</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Books Section */}
      <section id="featured" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Sách nổi bật
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những cuốn sách được yêu thích nhất và đánh giá cao từ cộng đồng độc giả
            </p>
          </div>

          {isBookLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks?.map((book) => (
                <BookCard key={book.bookId} book={book} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/books')}
              className="px-8"
            >
              Xem tất cả sách
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Thể loại sách
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các thể loại sách đa dạng phù hợp với sở thích của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Array.isArray(genres) && genres?.map((genre) => (
              <Card 
                key={genre.genreId} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                onClick={() => navigate(`/genre/${genre.genreId}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{genre.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {booksByGenre[genre.genreId]?.length || 0} sách
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-auto mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Books by Category Sections */}
      {Array.isArray(genres) && genres?.slice(0, 3).map((genre) => {
        const genreBooks = booksByGenre[genre.genreId];
        if (!genreBooks || genreBooks.length === 0) return null;

        return (
          <section key={genre.genreId} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {genre.name}
                  </h2>
                  <p className="text-gray-600">
                    Khám phá những cuốn sách hay trong thể loại {genre.name.toLowerCase()}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/genre/${genre.genreId}`)}
                  className="hidden md:flex"
                >
                  Xem thêm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {genreBooks.map((book : Book) => (
                  <BookCard key={book.bookId} book={book} />
                ))}
              </div>

              <div className="text-center mt-8 md:hidden">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/genre/${genre.genreId}`)}
                >
                  Xem thêm {genre.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        );
      })}

      {/* Popular Books Section */}
      {!isBookLoading && popularBooks?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Sách phổ biến
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những cuốn sách được mua nhiều nhất và có lượt đánh giá cao
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBooks.map((book) => (
                <BookCard key={book.bookId} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bắt đầu hành trình đọc sách của bạn ngay hôm nay!
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Tham gia cộng đồng hàng nghìn độc giả và khám phá những cuốn sách tuyệt vời
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              onClick={() => navigate('/signup')}
            >
              Đăng ký ngay
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
              onClick={() => {
                const featuredSection = document.getElementById('featured');
                featuredSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Khám phá sách
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
