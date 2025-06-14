import type { Genre } from './genre.type';

export type Book = {
  bookId: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  genre: Genre;
  createdAt: string;
};