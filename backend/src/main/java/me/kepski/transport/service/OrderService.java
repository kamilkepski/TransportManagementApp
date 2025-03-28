package me.kepski.transport.service;

import me.kepski.transport.dto.OrderDetailsDTO;
import me.kepski.transport.dto.OrderUpdateDTO;
import me.kepski.transport.dto.RouteRequestDTO;
import me.kepski.transport.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
    Page<OrderDetailsDTO> getOrdersPage(Pageable pageable, Status status);
    Order updateOrder(Long id, Order order);
    //Order updateOrderDTO(Long id, OrderUpdateDTO orderUpdateDTO);
    Order updateRouteForOrder(Long id, RouteRequestDTO routePoints);
    void deleteOrder(Long id);
    List<Order> getOrdersByDriverId(Long driverId);
    List<DriverAssignment> findDriverAssignmentsByOrderAndDriverAndDate(Long orderId, Long driverId, LocalDate assignmentDate);
    List<DriverAssignment> findDriverAssignmentsByOrderAndDriver(Long orderId, Long driverId);
    DriverAssignment updateDriverAssignment(Long id, DriverAssignment driverAssignment);
    DriverAssignment endDriverAssignment(Long id, DriverAssignment driverAssignment);
    List<DriverAssignment> findDriverAssignmentsByDriver(Long driverId);
    List<DriverAssignment> findByOrder(Long orderId);
    Page<Order> getOrdersByDriverIdPageable(Long driverId, Pageable pageable);
    void updateOrderWithAssignments(OrderUpdateDTO orderRequest);
}
