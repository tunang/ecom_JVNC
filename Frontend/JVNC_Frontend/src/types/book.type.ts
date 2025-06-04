type Book = {
  book_id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  genre_id: number;
  created_at: string; // or Date if you're parsing it to a Date object
};