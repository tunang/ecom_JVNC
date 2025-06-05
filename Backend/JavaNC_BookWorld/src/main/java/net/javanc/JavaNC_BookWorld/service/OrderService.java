package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.dto.OrderRequest;
import net.javanc.JavaNC_BookWorld.model.*;
import net.javanc.JavaNC_BookWorld.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Order createOrder(OrderRequest orderRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("Pending");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getOrderItems()) {
            Book book = bookRepository.findById(itemRequest.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            OrderItem item = new OrderItem();
            item.setBook(book);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice()); // hoặc book.getPrice() nếu muốn cố định theo giá sách
            item.setOrder(order);

            orderItems.add(item);
            total = total.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);

        return orderRepository.save(order);
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
}
