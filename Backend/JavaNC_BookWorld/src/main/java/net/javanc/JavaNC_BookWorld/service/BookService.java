package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.model.Book;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<Book> getAllBooks();
    Optional<Book> getBookById(Long bookId);
    Book saveBook(Book book);
    Book updateBook(Long id, Book book);
    void deleteBook(Long bookId);
}
