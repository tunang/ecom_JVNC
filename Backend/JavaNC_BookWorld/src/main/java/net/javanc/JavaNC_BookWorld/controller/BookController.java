package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.javanc.JavaNC_BookWorld.dto.BookDTO;
import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.service.BookService;
import net.javanc.JavaNC_BookWorld.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Book", description = "Quản lý sách")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private GenreService genreService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả sách")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết sách theo ID")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Thêm sách mới")
    public ResponseEntity<?> createBook(@ModelAttribute BookDTO bookDTO) {
        try {
            Book newBook = bookService.createBook(bookDTO);
            return ResponseEntity.ok(newBook);
        } catch (MultipartException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "Cập nhật sách theo ID")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @ModelAttribute BookDTO bookDTO) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDTO);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi cập nhật sách: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sách theo ID")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/genre/{genreId}")
    @Operation(summary = "Lấy sách theo genreId")
    public ResponseEntity<?> getBooksByGenre(@PathVariable Long genreId) {
        try {
            // Kiểm tra thể loại có tồn tại không (nếu không trả về 404)
            if (!genreService.existsById(genreId)) {
                return ResponseEntity.status(404).body("Thể loại với ID " + genreId + " không tồn tại.");
            }

            List<Book> books = bookService.getBooksByGenreId(genreId);
            if (books.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content
            }

            return ResponseEntity.ok(books); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi máy chủ: " + e.getMessage()); // 500 Internal Server Error
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm sách")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String title) {
        List<Book> books = bookService.searchBooksByTitle(title);
        if (books.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(books);
    }
}
