package net.javanc.JavaNC_BookWorld.controller;

import net.javanc.JavaNC_BookWorld.dto.PayOSWebhookRequest;
import net.javanc.JavaNC_BookWorld.service.OrderService;
import net.javanc.JavaNC_BookWorld.service.PayOSWebhookVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook/payos")
public class PayOSWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(PayOSWebhookController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private PayOSWebhookVerifier webhookVerifier;

    @PostMapping
    public ResponseEntity<?> handleWebhook(@RequestBody PayOSWebhookRequest webhookRequest) {
        logger.info("Received webhook: orderCode={}, status={}",
                webhookRequest.getOrderCode(), webhookRequest.getStatus());
        try {
            if (!webhookVerifier.verifySignature(webhookRequest)) {
                logger.error("Invalid signature for webhook: {}", webhookRequest.getOrderCode());
                return ResponseEntity.badRequest().body("Invalid signature");
            }

            String status = webhookRequest.getStatus();

            // Xử lý trạng thái thanh toán
            if ("Paid".equalsIgnoreCase(status) || "Success".equalsIgnoreCase(status)) {
                orderService.updateOrderStatusByOrderCode(
                        Long.valueOf(webhookRequest.getOrderCode()),
                        "PAID"
                );
                logger.info("Order {} marked as PAID", webhookRequest.getOrderCode());
            } else if ("Pending".equalsIgnoreCase(status)) {
                orderService.updateOrderStatusByOrderCode(
                        Long.valueOf(webhookRequest.getOrderCode()),
                        "PENDING"
                );
                logger.info("Order {} marked as PENDING", webhookRequest.getOrderCode());
            } else if ("Failed".equalsIgnoreCase(status) || "Cancelled".equalsIgnoreCase(status)) {
                orderService.updateOrderStatusByOrderCode(
                        Long.valueOf(webhookRequest.getOrderCode()),
                        "FAILED"
                );
                logger.info("Order {} marked as FAILED", webhookRequest.getOrderCode());
            } else {
                logger.warn("Received unknown status '{}' for order {}", status, webhookRequest.getOrderCode());
                // Có thể xử lý mặc định hoặc bỏ qua
            }

            logger.info("Webhook processed successfully for orderCode={}", webhookRequest.getOrderCode());
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            logger.error("Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error processing webhook: " + e.getMessage());
        }
    }
}