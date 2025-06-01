package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepo;

    @Override
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    @Override
    public Optional<Book> getBookById(String id) {
        return bookRepo.findById(id);
    }

    @Override
    public Book saveBook(Book book) {
        return bookRepo.save(book);
    }

    @Override
    public Book updateBook(String id, Book updated) {
        return bookRepo.findById(id).map(book -> {
            book.setTitle(updated.getTitle());
            book.setAuthor(updated.getAuthor());
            book.setDescription(updated.getDescription());
            book.setPrice(updated.getPrice());
            book.setStock(updated.getStock());
            book.setGenre(updated.getGenre());
            return bookRepo.save(book);
        }).orElse(null);
    }

    @Override
    public void deleteBook(String id) {
        bookRepo.deleteById(id);
    }
}
