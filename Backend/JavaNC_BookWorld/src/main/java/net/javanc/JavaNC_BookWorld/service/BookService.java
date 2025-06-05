package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.dto.BookDTO;
import net.javanc.JavaNC_BookWorld.model.Book;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<Book> getAllBooks();

    Optional<Book> getBookById(Long bookId);

    Book createBook(BookDTO bookDTO);

    Book updateBook(Long id, BookDTO bookDTO);

    void deleteBook(Long bookId);

    List<Book> getBooksByGenreId(Long genreId);

    List<Book> searchBooksByTitle(String keyword);
}
