package me.kepski.transport.repository;

import me.kepski.transport.entity.OrderVehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderVehicleAssignmentRepository extends JpaRepository<OrderVehicleAssignment, Long> {
}
