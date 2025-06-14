package net.javanc.JavaNC_BookWorld.controller;

import net.javanc.JavaNC_BookWorld.dto.PayOSWebhookRequest;
import net.javanc.JavaNC_BookWorld.service.OrderService;
import net.javanc.JavaNC_BookWorld.service.PayOSWebhookVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid signature"));
            }

            String status = webhookRequest.getStatus();
            Long orderCode = Long.valueOf(webhookRequest.getOrderCode());

            switch (status.toUpperCase()) {
                case "PAID":
                case "SUCCESS":
                    orderService.updateOrderStatusByOrderCode(orderCode, "PAID");
                    logger.info("Order {} marked as PAID", orderCode);
                    break;
                case "PENDING":
                    orderService.updateOrderStatusByOrderCode(orderCode, "PENDING");
                    logger.info("Order {} marked as PENDING", orderCode);
                    break;
                case "FAILED":
                    orderService.updateOrderStatusByOrderCode(orderCode, "FAILED");
                    logger.info("Order {} marked as FAILED", orderCode);
                    break;
                case "CANCELLED":
                    orderService.updateOrderStatusByOrderCode(orderCode, "CANCELED");
                    logger.info("Order {} marked as CANCELED", orderCode);
                    break;
                default:
                    logger.warn("Unknown status '{}' for order {}", status, orderCode);
            }

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}