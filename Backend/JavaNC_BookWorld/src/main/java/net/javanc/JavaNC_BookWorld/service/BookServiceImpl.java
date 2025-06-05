package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.dto.BookDTO;
import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.repository.BookRepository;
import net.javanc.JavaNC_BookWorld.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private GenreRepository genreRepo;

    @Autowired
    private ImageUploadService imageUploadService;

    @Override
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    @Override
    public Optional<Book> getBookById(Long bookId) {
        return bookRepo.findById(bookId);
    }

    @Override
    public Book createBook(BookDTO dto) {
        Book book = mapDTOToBook(new Book(), dto);
        return bookRepo.save(book);
    }

    @Override
    public Book updateBook(Long id, BookDTO dto) {
        return bookRepo.findById(id).map(existingBook -> {
            Book updatedBook = mapDTOToBook(existingBook, dto);
            return bookRepo.save(updatedBook);
        }).orElseThrow(() -> new RuntimeException("Sách không tồn tại"));
    }

    @Override
    public void deleteBook(Long bookId) {
        if (!bookRepo.existsById(bookId)) {
            throw new RuntimeException("Sách không tồn tại");
        }
        bookRepo.deleteById(bookId);
    }

    private Book mapDTOToBook(Book book, BookDTO dto) {
        if (dto.getTitle() != null) book.setTitle(dto.getTitle());
        if (dto.getAuthor() != null) book.setAuthor(dto.getAuthor());
        if (dto.getDescription() != null) book.setDescription(dto.getDescription());
        if (dto.getPrice() != null) book.setPrice(dto.getPrice());
        if (dto.getStock() != null) book.setStock(dto.getStock());

        if (dto.getGenreId() != null) {
            genreRepo.findById(dto.getGenreId()).ifPresent(book::setGenre);
        }

        if (dto.getCoverImage() != null && !dto.getCoverImage().isEmpty()) {
            try {
                String imageUrl = imageUploadService.uploadImageToFolder(dto.getCoverImage(), "bookworld/books");
                book.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi upload ảnh bìa sách: " + e.getMessage(), e);
            }
        }

        return book;
    }

    @Override
    public List<Book> getBooksByGenreId(Long genreId) {
        return bookRepo.findByGenreGenreId(genreId);
    }

    @Override
    public List<Book> searchBooksByTitle(String keyword) {
        return bookRepo.findByTitleContainingIgnoreCase(keyword);
    }
}
