package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.CartItem;
import net.javanc.JavaNC_BookWorld.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUser_UserId(Long userId);

    CartItem findByUser_UserIdAndBook_BookId(Long userId, Long bookId);
}
