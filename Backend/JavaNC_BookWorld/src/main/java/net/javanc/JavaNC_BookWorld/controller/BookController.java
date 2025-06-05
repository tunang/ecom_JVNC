package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.javanc.JavaNC_BookWorld.dto.BookDTO;
import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.service.BookService;
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
}
