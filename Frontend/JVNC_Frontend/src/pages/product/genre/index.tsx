import BookGrid from "@/components/ui/book-grid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBooksByGenreRequest } from "@/store/slices/bookSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Genre = () => {
  const dispatch = useAppDispatch();

  const { genreId } = useParams();
  const { books } = useAppSelector((state) => state.book);

  console.log(books);

  useEffect(() => {
    dispatch(fetchBooksByGenreRequest({ genreId: Number(genreId) }));
  }, [dispatch, genreId]);
  return (
    <div>
        <BookGrid
          books={books}
          
        //   onToggleFavorite={handleToggleFavorite}
        //   favoriteBooks={[1, 3, 5]}
          loading={false}
        />
      </div>
  );
};

export default Genre;
