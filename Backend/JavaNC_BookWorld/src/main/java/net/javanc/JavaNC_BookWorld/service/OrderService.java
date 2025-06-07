    package net.javanc.JavaNC_BookWorld.service;

    import net.javanc.JavaNC_BookWorld.dto.OrderRequest;
    import net.javanc.JavaNC_BookWorld.model.*;
    import net.javanc.JavaNC_BookWorld.repository.*;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import vn.payos.PayOS;
    import vn.payos.type.PaymentData;
    import vn.payos.type.ItemData;
    import vn.payos.type.CheckoutResponseData;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;

    @Service
    public class OrderService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private BookRepository bookRepository;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private PayOS payOS;

        public Order createOrder(OrderRequest orderRequest, String email) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Tạo đơn hàng
            Order order = new Order();
            order.setUser(user);
            order.setStatus("Pending");
            order.setAddress(orderRequest.getAddress());
            order.setPhone(orderRequest.getPhone());
            order.setCreatedAt(LocalDateTime.now());

            // Tính tổng tiền và danh sách sản phẩm
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;

            for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getOrderItems()) {
                Book book = bookRepository.findById(itemRequest.getBookId())
                        .orElseThrow(() -> new RuntimeException("Book not found"));

                OrderItem item = new OrderItem();
                item.setBook(book);
                item.setQuantity(itemRequest.getQuantity());
                item.setPrice(itemRequest.getPrice());
                item.setOrder(order);

                orderItems.add(item);
                total = total.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            order.setOrderItems(orderItems);
            order.setTotalAmount(total);

            // Lưu đơn hàng để lấy orderId
            Order savedOrder = orderRepository.save(order);

            // Tạo link thanh toán
            String paymentUrl = createPaymentLink(savedOrder);
            savedOrder.setPaymentUrl(paymentUrl);

            // Lưu lại đơn hàng đã có link
            return orderRepository.save(savedOrder);
        }

        public List<Order> getOrdersByUserEmail(String email) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return orderRepository.findByUser(user);
        }

        public Order getOrderById(Long orderId) {
            return orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
        }

        public Order updateOrderStatus(Long orderId, String status) {
            Order order = getOrderById(orderId);
            order.setStatus(status);
            return orderRepository.save(order);
        }

        public void deleteOrder(Long orderId) {
            if (!orderRepository.existsById(orderId)) {
                throw new RuntimeException("Order not found");
            }
            orderRepository.deleteById(orderId);
        }

        public String createPaymentLink(Order order) {
            ItemData item = ItemData.builder()
                    .name("Đơn hàng #" + order.getOrderId())
                    .quantity(1)
                    .price(order.getTotalAmount().intValue())
                    .build();

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(order.getOrderId()) // orderId là Long -> hợp lệ
                    .amount(order.getTotalAmount().intValue())
                    .description("Thanh toán đơn hàng #" + order.getOrderId())
                    .returnUrl("https://bookworld.vn/thank-you")
                    .cancelUrl("https://bookworld.vn/cancel")
                    .items(List.of(item))
                    .build();

            CheckoutResponseData response = null;
            try {
                response = payOS.createPaymentLink(paymentData);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Tạo link thanh toán thất bại: " + e.getMessage(), e);
            }
            return response.getCheckoutUrl();
        }

        public void updateOrderStatusByOrderCode(Long orderCode, String status) {
            Order order = orderRepository.findById(orderCode)
                    .orElseThrow(() -> new RuntimeException("Order not found with orderCode: " + orderCode));

            // Map trạng thái
            if ("PAID".equalsIgnoreCase(status)) {
                order.setStatus("Đã thanh toán");
            } else if ("FAILED".equalsIgnoreCase(status)) {
                order.setStatus("Thanh toán thất bại");
            } else if ("CANCELED".equalsIgnoreCase(status)) {
                order.setStatus("Đã hủy");
            } else {
                order.setStatus(status);
            }

            orderRepository.save(order);
        }
    }
