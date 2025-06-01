package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long > {
    // Tùy ý thêm phương thức custom, ví dụ:
    // List<Book> findByTitleContainingIgnoreCase(String keyword);
}