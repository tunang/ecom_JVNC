package net.javanc.JavaNC_BookWorld.service;

import jakarta.transaction.Transactional;
import net.javanc.JavaNC_BookWorld.model.CartItem;
import net.javanc.JavaNC_BookWorld.model.Order;
import net.javanc.JavaNC_BookWorld.model.OrderItem;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.CartItemRepository;
import net.javanc.JavaNC_BookWorld.repository.OrderItemRepository;
import net.javanc.JavaNC_BookWorld.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentService paymentService;

    @Autowired
    public OrderService(CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        PaymentService paymentService) {
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public String createOrderFromCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUser_UserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(ci -> ci.getBook().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        User user = cartItems.get(0).getUser();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus("Pending");
        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setBook(ci.getBook());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getBook().getPrice());
            orderItems.add(oi);
        }
        orderItemRepository.saveAll(orderItems);

        cartItemRepository.deleteAll(cartItems);

        return paymentService.createPayment(order);
    }

    public void handlePaymentWebhook(Map<String, Object> payload) {
        paymentService.processWebhook(payload);
    }
}
