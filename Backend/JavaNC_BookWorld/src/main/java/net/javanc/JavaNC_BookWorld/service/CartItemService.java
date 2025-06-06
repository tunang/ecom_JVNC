package net.javanc.JavaNC_BookWorld.service;

import jakarta.transaction.Transactional;
import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.model.CartItem;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.BookRepository;
import net.javanc.JavaNC_BookWorld.repository.CartItemRepository;
import net.javanc.JavaNC_BookWorld.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public CartItem addToCart(User user, Book book, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        CartItem existingItem = cartItemRepository.findByUser_UserIdAndBook_BookId(user.getUserId(), book.getBookId());

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setBook(book);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    public CartItem updateQuantity(Long cartItemId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("Cart item not found");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    public List<CartItem> getCartItemsByUser(Long userId) {
        return cartItemRepository.findByUser_UserId(userId);
    }
    public void clearCartByUser(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(cartItems);
    }
}

