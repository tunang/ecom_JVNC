package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.model.Order;
import net.javanc.JavaNC_BookWorld.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PaymentService {

    @Value("${payos.api.key}")
    private String apiKey;

    @Value("${payos.api.url}")
    private String payosApiUrl;

    @Value("${app.payment.webhook-url}")
    private String webhookUrl;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String createPayment(Order order) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = Map.of(
                "order_id", order.getOrderId().toString(),
                "amount", order.getTotalAmount(),
                "webhook_url", webhookUrl,
                "return_url", "https://yourfrontend.com/payment-return"
        );

        HttpHeaders headers = new HttpHeaders();   // Đây là HttpHeaders của Spring
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);  // hoặc headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(payosApiUrl, entity, Map.class);

        if(response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("payment_url");
        } else {
            throw new RuntimeException("Không tạo được payment PayOS");
        }
    }
    public void processWebhook(Map<String, Object> payload) {
        try {
            String status = (String) payload.get("status"); // trạng thái: "PAID", "FAILED", ...
            String orderIdStr = String.valueOf(payload.get("order_id"));

            if (status != null && orderIdStr != null) {
                Long orderId = Long.parseLong(orderIdStr);

                orderRepository.findById(orderId).ifPresent(order -> {
                    order.setStatus(status); // cập nhật trạng thái
                    orderRepository.save(order);
                });
            } else {
                System.out.println("Webhook không hợp lệ: thiếu status hoặc order_id");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi xử lý webhook: " + e.getMessage());
        }
    }
}
