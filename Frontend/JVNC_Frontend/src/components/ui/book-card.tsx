import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardFooter } from './card';
import type { Book } from '@/types/book.type';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  isFavorite?: boolean;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  className = "",
}) => {

  const navigate = useNavigate();   


  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return 'destructive';
    if (stock < 10) return 'secondary';
    return 'default';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Hết hàng';
    if (stock < 10) return `Còn ${stock} cuốn`;
    return 'Còn hàng';
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`} onClick={() => {
      navigate(`/product/${book.bookId}`);
    }}>
      {/* Image Container */}
      <div className="relative h-[360px] aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';
          }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-gray-600 opacity-0 transition-all duration-300 hover:bg-white hover:text-red-500 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        )}

        {/* Genre Badge */}
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs font-medium"
        >
          {book.genre?.name || 'Chưa phân loại'}
        </Badge>

        {/* Stock Badge */}
        <Badge
          variant={getStockBadgeVariant(book.stock)}
          className="absolute bottom-2 left-2 text-xs font-medium"
        >
          {getStockText(book.stock)}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-600 font-medium">
          {book.author}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {truncateText(book.description, 80)}
        </p>

        {/* Rating (placeholder - you can add actual ratings later) */}
        {/* <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">(4.0)</span>
        </div> */}
      </CardContent>

      <CardFooter className="px-4 pt-0 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(book.price)}
            </p>
            <p className="text-xs text-gray-500">Giá đã bao gồm VAT</p>
          </div>
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
            disabled={book.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        )}
      </CardFooter>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </Card>
  );
};

export default BookCard; 