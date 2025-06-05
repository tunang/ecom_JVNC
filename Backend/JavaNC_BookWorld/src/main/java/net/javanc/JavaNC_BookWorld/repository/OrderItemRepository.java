package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
