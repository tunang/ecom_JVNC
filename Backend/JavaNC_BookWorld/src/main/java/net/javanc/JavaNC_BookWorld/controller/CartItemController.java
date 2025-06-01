package net.javanc.JavaNC_BookWorld.controller;

import net.javanc.JavaNC_BookWorld.model.CartItem;
import net.javanc.JavaNC_BookWorld.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    // Lấy danh sách tất cả sản phẩm trong giỏ hàng của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCartItemsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(cartItemService.getCartItemsByUserId(userId));
    }

    // Thêm sản phẩm vào giỏ hàng hoặc tăng số lượng nếu đã tồn tại
    @PostMapping
    public ResponseEntity<CartItem> addCartItem(
            @RequestParam Long userId,
            @RequestParam Long bookId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartItemService.addOrUpdateCartItem(userId, bookId, quantity));
    }

    // Cập nhật số lượng một sản phẩm trong giỏ hàng
    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @PathVariable("id") Long cartItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartItemService.updateQuantity(cartItemId, quantity));
    }

    // Xóa một sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable("id") Long cartItemId) {
        cartItemService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    // Xóa toàn bộ giỏ hàng của người dùng
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartItemService.clearCartByUser(userId);
        return ResponseEntity.noContent().build();
    }
}
