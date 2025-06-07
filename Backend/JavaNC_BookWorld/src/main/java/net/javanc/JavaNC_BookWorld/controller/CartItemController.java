package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import net.javanc.JavaNC_BookWorld.dto.CartItemRequest;
import net.javanc.JavaNC_BookWorld.dto.UpdateQuantityRequest;
import net.javanc.JavaNC_BookWorld.model.Book;
import net.javanc.JavaNC_BookWorld.model.CartItem;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.BookRepository;
import net.javanc.JavaNC_BookWorld.repository.UserRepository;
import net.javanc.JavaNC_BookWorld.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private final CartItemService cartService;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CartItemController(CartItemService cartService, UserRepository userRepository, BookRepository bookRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    // Thêm sản phẩm vào giỏ, lấy user từ JWT (email)
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    @Operation(summary = "Thêm vào giỏ hàng")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            CartItem added = cartService.addToCart(user, book, request.getQuantity());
            return ResponseEntity.ok(added);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật số lượng trong giỏ
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{cartItemId}")
    @Operation(summary = "Cập nhật số lượng trong giỏ")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartItemId, @RequestBody UpdateQuantityRequest request) {
        try {
            CartItem updated = cartService.updateQuantity(cartItemId, request.getQuantity());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa sản phẩm khỏi giỏ
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{cartItemId}")
    @Operation(summary = "Xóa sản phẩm khỏi giỏ")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        try {
            cartService.removeFromCart(cartItemId);
            return ResponseEntity.ok("Removed from cart");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy danh sách giỏ hàng của user hiện tại
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    @Operation(summary = "Lấy danh sách giỏ hàng của user hiện tại")
    public ResponseEntity<?> getMyCart() {
        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<CartItem> items = cartService.getCartItemsByUser(user.getUserId());
            return ResponseEntity.ok(items);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Xoá toàn bộ giỏ hàng của người dùng hiện tại")
    public ResponseEntity<?> clearUserCart() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.clearCartByUser(user);
        return ResponseEntity.ok("Đã xoá toàn bộ giỏ hàng");
    }
}

