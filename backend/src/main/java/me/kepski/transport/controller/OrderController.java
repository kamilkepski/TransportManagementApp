package me.kepski.transport.controller;

import me.kepski.transport.config.CustomUserDetails;
import me.kepski.transport.dto.*;
import me.kepski.transport.entity.*;
import me.kepski.transport.service.DriverService;
import me.kepski.transport.service.OrderService;
import me.kepski.transport.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final VehicleService vehicleService;
    private final DriverService driverService;

    public OrderController(OrderService orderService, VehicleService vehicleService, DriverService driverService) {
        this.orderService = orderService;
        this.vehicleService = vehicleService;
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<?> getOrders(
            @RequestParam(required = false) Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) Status status) {

        if (id != null) {
            Order order = orderService.getOrderById(id);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            OrderDetailsDTO orderDetailsDTO = OrderMapper.toOrderDTO(order);
            return ResponseEntity.ok(orderDetailsDTO);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDetailsDTO> orders = orderService.getOrdersPage(pageable, status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/driver")
    public List<Order> getOrdersByDriverId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();
        List<Order> orders = orderService.getOrdersByDriverId(driverId);

        for (Order order : orders) {
            for (OrderVehicleAssignment va : order.getVehicleAssignments()) {
                va.setDriverAssignments(va.getDriverAssignments().stream()
                        .filter(da -> da.getDriver().getId().equals(driverId))
                        .collect(Collectors.toList()));
            }
        }
        return orders;
    }

    @GetMapping("/driver/pageable")
    public Page<Order> getOrdersByDriverIdPageable(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();

        Page<Order> orders = orderService.getOrdersByDriverIdPageable(driverId, pageable);

        for (Order order : orders) {
            for (OrderVehicleAssignment va : order.getVehicleAssignments()) {
                va.setDriverAssignments(va.getDriverAssignments().stream()
                        .filter(da -> da.getDriver().getId().equals(driverId))
                        .collect(Collectors.toList()));
            }
        }
        return orders;
    }

    @GetMapping("/routes")
    public List<Order> getOrdersWithAssignments() {
        List<Order> orders = orderService.getAllOrders();

        for (Order order : orders) {
            for (OrderVehicleAssignment va : order.getVehicleAssignments()) {
                va.setDriverAssignments(va.getDriverAssignments().stream()
                        .filter(da -> da.isActive())
                        .collect(Collectors.toList()));
            }
        }
        return orders;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        Order order = new Order();
        order.setName(orderRequest.getName());
        order.setTitle(orderRequest.getTitle());
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setDate(orderRequest.getDate());
        order.setStartDate(orderRequest.getStartDate());
        order.setEndDate(orderRequest.getEndDate());
        order.setTime(LocalTime.parse(orderRequest.getTime()));
        order.setStartPoint(orderRequest.getStartPoint());
        order.setDestination(orderRequest.getDestination());
        order.setNumberOfPassengers(orderRequest.getNumberOfPassengers());

        for (AssignmentRequestDTO assignmentRequest : orderRequest.getAssignments()) {
            Vehicle vehicle = vehicleService.getVehicleById(assignmentRequest.getVehicleId());
            Driver driver1 = driverService.getDriverById(assignmentRequest.getDriver1Id());
            Driver driver2 = assignmentRequest.getDriver2Id() != null
                    ? driverService.getDriverById(assignmentRequest.getDriver2Id())
                    : null;

            OrderVehicleAssignment assignment = new OrderVehicleAssignment();
            assignment.setOrder(order);
            assignment.setVehicle(vehicle);
            order.getVehicleAssignments().add(assignment);

            if (orderRequest.getDate() != null) {
                LocalDate date = orderRequest.getDate();
                addDriverAssignments(assignment, driver1, driver2, date);
            } else {
                LocalDate startDate = orderRequest.getStartDate();
                LocalDate endDate = orderRequest.getEndDate();
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                    addDriverAssignments(assignment, driver1, driver2, date);
                }
            }
        }

        order.setStatus(Status.PRZYJETE);
        orderService.createOrder(order);
        return ResponseEntity.ok("Zlecenie zostało utworzone.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Zlecenie zostało usunięte.");
    }

    @PutMapping
    public ResponseEntity<?> updateOrder(@RequestBody OrderUpdateDTO orderRequest) {
        try {
            orderService.updateOrderWithAssignments(orderRequest);
            return ResponseEntity.ok("Zlecenie zostało zaktualizowane.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private void addDriverAssignments(OrderVehicleAssignment assignment, Driver driver1, Driver driver2, LocalDate date) {
        DriverAssignment driverAssignment1 = new DriverAssignment();
        driverAssignment1.setDriver(driver1);
        driverAssignment1.setOrderVehicleAssignment(assignment);
        driverAssignment1.setDate(date);
        driverAssignment1.setActive(true);

        assignment.getDriverAssignments().add(driverAssignment1);

        if (driver2 != null) {
            DriverAssignment driverAssignment2 = new DriverAssignment();
            driverAssignment2.setDriver(driver2);
            driverAssignment2.setOrderVehicleAssignment(assignment);
            driverAssignment2.setDate(date);
            driverAssignment2.setActive(true);

            assignment.getDriverAssignments().add(driverAssignment2);
        }
    }
}
