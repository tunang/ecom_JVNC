package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.Order;
import net.javanc.JavaNC_BookWorld.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
