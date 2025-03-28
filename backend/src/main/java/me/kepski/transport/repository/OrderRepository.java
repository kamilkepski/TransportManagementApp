package me.kepski.transport.repository;

import me.kepski.transport.entity.Order;
import me.kepski.transport.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByStatus(Status status, Pageable pageable);
}
