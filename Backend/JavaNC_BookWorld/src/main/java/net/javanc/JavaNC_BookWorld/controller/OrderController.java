package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import net.javanc.JavaNC_BookWorld.dto.OrderRequest;
import net.javanc.JavaNC_BookWorld.model.Order;
import net.javanc.JavaNC_BookWorld.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Tạo đơn hàng mới cho người dùng từ JWT")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Order createdOrder = orderService.createOrder(orderRequest, email);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lấy danh sách đơn hàng của người dùng hiện tại")
    public ResponseEntity<?> getUserOrders() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.getOrdersByUserEmail(email));
    }

    @GetMapping("/{orderId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lấy chi tiết một đơn hàng")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PutMapping("/{orderId}/status")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cập nhật trạng thái đơn hàng (chỉ dành cho admin)")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @DeleteMapping("/{orderId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Xoá đơn hàng")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Đã xoá đơn hàng thành công");
    }
}
