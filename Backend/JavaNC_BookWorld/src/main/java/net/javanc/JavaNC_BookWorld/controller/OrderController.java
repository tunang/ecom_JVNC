package net.javanc.JavaNC_BookWorld.controller;

import net.javanc.JavaNC_BookWorld.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable Long userId) {
        try {
            String paymentUrl = orderService.createOrderFromCart(userId);
            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Webhook endpoint PayOS gọi về
    @PostMapping("/payment/webhook")
    public ResponseEntity<String> webhook(@RequestBody Map<String, Object> payload) {
        orderService.handlePaymentWebhook(payload);
        return ResponseEntity.ok("OK");
    }
}
