package net.javanc.JavaNC_BookWorld.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import net.javanc.JavaNC_BookWorld.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@RestController
@RequestMapping("/api/webhook")
public class PayOSWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(PayOSWebhookController.class);

    @Autowired
    private PayOS payOS;

    @Autowired
    private OrderService orderService;

    @PostMapping("/payos")
    public ObjectNode handleWebhook(@RequestBody ObjectNode body) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode response = mapper.createObjectNode();

        try {
            Webhook webhookBody = mapper.treeToValue(body, Webhook.class);
            WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);

            logger.info("✅ Webhook xác thực thành công: orderCode={}", data.getOrderCode());

            // Xử lý đơn hàng tại đây
            orderService.markOrderAsPaid(data.getOrderCode());

            response.put("error", 0);
            response.put("message", "Webhook delivered");
            response.set("data", null);
        } catch (Exception e) {
            logger.warn("❌ Webhook xác thực thất bại: {}", e.getMessage());
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
        }

        return response;
    }
}
