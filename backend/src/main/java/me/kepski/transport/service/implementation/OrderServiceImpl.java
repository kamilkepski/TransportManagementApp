package me.kepski.transport.service.implementation;

import jakarta.transaction.Transactional;
import me.kepski.transport.dto.*;
import me.kepski.transport.entity.*;
import me.kepski.transport.repository.DriverAssignmentRepository;
import me.kepski.transport.repository.OrderRepository;
import me.kepski.transport.service.DriverService;
import me.kepski.transport.service.OrderService;
import me.kepski.transport.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DriverService driverService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Page<OrderDetailsDTO> getOrdersPage(Pageable pageable, Status status) {
        if (status != null) {
            return orderRepository.findByStatus(status, pageable)
                    .map(OrderMapper::toOrderDTO);
        } else {
            return orderRepository.findAll(pageable)
                    .map(OrderMapper::toOrderDTO);
        }
    }


    @Override
    public Order updateOrder(Long id, Order order) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();

            existingOrder.setName(order.getName());
            existingOrder.setPhoneNumber(order.getPhoneNumber());
            existingOrder.setDate(order.getDate());
            existingOrder.setStartDate(order.getStartDate());
            existingOrder.setEndDate(order.getEndDate());
            existingOrder.setStartPoint(order.getStartPoint());
            existingOrder.setDestination(order.getDestination());
            existingOrder.setNumberOfPassengers(order.getNumberOfPassengers());

            return orderRepository.save(existingOrder);
        } else {
            throw new RuntimeException("Order not found with id " + id);
        }
    }

    @Override
    public Order updateRouteForOrder(Long id, RouteRequestDTO routePoints) {
        Optional<Order> existingOrder = orderRepository.findById(id);

        if (existingOrder.isPresent()) {
            Order orderToUpdate = existingOrder.get();
            orderToUpdate.setRoutePoints(routePoints.getCoordinates());

            return orderRepository.save(orderToUpdate);
        } else {
            throw new RuntimeException("Order not found with id " + id);
        }
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public List<Order> getOrdersByDriverId(Long driverId) {
        return driverAssignmentRepository.findOrdersByDriverId(driverId);
    }

    @Override
    public List<DriverAssignment> findDriverAssignmentsByOrderAndDriverAndDate(Long orderId, Long driverId, LocalDate assignmentDate) {
        return driverAssignmentRepository.findByOrderAndDriverIdAndAssignmentDate(orderId, driverId, assignmentDate);
    }

    @Override
    public List<DriverAssignment> findDriverAssignmentsByOrderAndDriver(Long orderId, Long driverId) {
        return driverAssignmentRepository.findByOrderAndDriverId(orderId, driverId);
    }

    @Override
    public DriverAssignment updateDriverAssignment(Long id, DriverAssignment driverAssignment) {
        Optional<DriverAssignment> existingDriverAssignment = driverAssignmentRepository.findById(id);
        if (existingDriverAssignment.isPresent()) {
            DriverAssignment updatedDriverAssignment = existingDriverAssignment.get();
            updatedDriverAssignment.setStartMileage(driverAssignment.getStartMileage());
            updatedDriverAssignment.setStartTime(driverAssignment.getStartTime());
            updatedDriverAssignment.setWorking(driverAssignment.isWorking());
            return driverAssignmentRepository.save(updatedDriverAssignment);
        } else {
            throw new RuntimeException("Order not found with id " + id);
        }
    }

    @Override
    public DriverAssignment endDriverAssignment(Long id, DriverAssignment driverAssignment) {
        Optional<DriverAssignment> existingDriverAssignment = driverAssignmentRepository.findById(id);
        if (existingDriverAssignment.isPresent()) {
            DriverAssignment updatedDriverAssignment = existingDriverAssignment.get();
            updatedDriverAssignment.setEndMileage(driverAssignment.getEndMileage());
            updatedDriverAssignment.setEndTime(driverAssignment.getEndTime());
            updatedDriverAssignment.setWorking(driverAssignment.isWorking());
            return driverAssignmentRepository.save(updatedDriverAssignment);
        } else {
            throw new RuntimeException("Order not found with id " + id);
        }
    }

    @Override
    public List<DriverAssignment> findDriverAssignmentsByDriver(Long driverId) {
        return driverAssignmentRepository.findByDriverId(driverId);
    }

    @Override
    public List<DriverAssignment> findByOrder(Long orderId) {
        return driverAssignmentRepository.findByOrder(orderId);
    }

    @Override
    public Page<Order> getOrdersByDriverIdPageable(Long driverId, Pageable pageable) {
        return driverAssignmentRepository.findOrdersByDriverIdPageable(driverId, pageable);
    }

    @Override
    @Transactional
    public void updateOrderWithAssignments(OrderUpdateDTO orderRequest) {
        Optional<Order> existingOrderOpt = orderRepository.findById(orderRequest.getId());
        if (existingOrderOpt.isEmpty()) {
            throw new RuntimeException("Order not found with id " + orderRequest.getId());
        }

        Order existingOrder = existingOrderOpt.get();

        existingOrder.setName(orderRequest.getName());
        existingOrder.setPhoneNumber(orderRequest.getPhoneNumber());
        existingOrder.setDate(orderRequest.getDate());
        existingOrder.setStartDate(orderRequest.getStartDate());
        existingOrder.setEndDate(orderRequest.getEndDate());
        existingOrder.setTime(LocalTime.parse(orderRequest.getTime()));
        existingOrder.setStartPoint(orderRequest.getStartPoint());
        existingOrder.setDestination(orderRequest.getDestination());
        existingOrder.setNumberOfPassengers(orderRequest.getNumberOfPassengers());

        LocalDate startDate = null;
        LocalDate endDate = null;

        if (orderRequest.getDate() != null) {
            startDate = orderRequest.getDate();
            endDate = startDate;
        } else if (orderRequest.getStartDate() != null && orderRequest.getEndDate() != null) {
            startDate = orderRequest.getStartDate();
            endDate = orderRequest.getEndDate();
        } else {
            throw new RuntimeException("Date (for single day) or StartDate and EndDate (for multiple days) must be provided.");
        }

        updateVehicleAndDriverAssignments(existingOrder, orderRequest.getAssignments(), startDate, endDate);

        orderRepository.save(existingOrder);
    }

    private void updateVehicleAndDriverAssignments(Order order, List<AssignmentRequestDTO> assignments, LocalDate startDate, LocalDate endDate) {
        Map<Long, OrderVehicleAssignment> currentAssignmentsMap = order.getVehicleAssignments().stream()
                .collect(Collectors.toMap(
                        ova -> ova.getVehicle().getId(),
                        ova -> ova
                ));

        List<OrderVehicleAssignment> updatedAssignments = new ArrayList<>();

        for (AssignmentRequestDTO newAssignment : assignments) {
            Long vehicleId = newAssignment.getVehicleId();
            Long driver1Id = newAssignment.getDriver1Id();
            Long driver2Id = newAssignment.getDriver2Id();

            OrderVehicleAssignment currentAssignment = currentAssignmentsMap.get(vehicleId);

            if (currentAssignment != null) {
                handleDriverAssignments(currentAssignment, driver1Id, driver2Id, startDate, endDate);
                updatedAssignments.add(currentAssignment);
            } else {
                OrderVehicleAssignment newAssignmentEntity = new OrderVehicleAssignment();
                newAssignmentEntity.setOrder(order);
                newAssignmentEntity.setVehicle(vehicleService.getVehicleById(vehicleId));
                handleDriverAssignments(newAssignmentEntity, driver1Id, driver2Id, startDate, endDate);
                updatedAssignments.add(newAssignmentEntity);
            }
        }

        for (OrderVehicleAssignment existingAssignment : order.getVehicleAssignments()) {
            if (!updatedAssignments.contains(existingAssignment)) {
                existingAssignment.getDriverAssignments().forEach(da -> da.setActive(false));
            }
        }

        order.setVehicleAssignments(updatedAssignments);
    }

    private void handleDriverAssignments(OrderVehicleAssignment assignment, Long driver1Id, Long driver2Id, LocalDate startDate, LocalDate endDate) {
        List<DriverAssignment> currentDriverAssignments = assignment.getDriverAssignments();

        if (startDate.equals(endDate)) {
            if (driver1Id != null) {
                updateOrCreateDriverAssignment(currentDriverAssignments, assignment, driver1Id, startDate);
            }
            if (driver2Id != null) {
                updateOrCreateDriverAssignment(currentDriverAssignments, assignment, driver2Id, startDate);
            }
        } else {
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                if (driver1Id != null) {
                    updateOrCreateDriverAssignment(currentDriverAssignments, assignment, driver1Id, date);
                }
                if (driver2Id != null) {
                    updateOrCreateDriverAssignment(currentDriverAssignments, assignment, driver2Id, date);
                }
            }
        }

        for (DriverAssignment driverAssignment : currentDriverAssignments) {
            boolean shouldActivate = (driverAssignment.getDate().isAfter(startDate) && driverAssignment.getDate().isBefore(endDate))
                    || driverAssignment.getDate().isEqual(startDate) || driverAssignment.getDate().isEqual(endDate);
            if (shouldActivate && !driverAssignment.isActive()) {
                driverAssignment.setActive(true);
            } else if (!shouldActivate && driverAssignment.isActive()) {
                driverAssignment.setActive(false);
            }
        }

        deactivateRemovedDriverAssignments(currentDriverAssignments, driver1Id, driver2Id, startDate, endDate);
    }

    private void updateOrCreateDriverAssignment(List<DriverAssignment> currentDriverAssignments, OrderVehicleAssignment assignment, Long driverId, LocalDate date) {
        DriverAssignment existingAssignment = currentDriverAssignments.stream()
                .filter(da -> da.getDriver().getId().equals(driverId) && da.getDate().equals(date))
                .findFirst()
                .orElse(null);

        if (existingAssignment == null) {
            DriverAssignment newDriverAssignment = new DriverAssignment();
            newDriverAssignment.setOrderVehicleAssignment(assignment);
            newDriverAssignment.setDriver(driverService.getDriverById(driverId));
            newDriverAssignment.setDate(date);
            newDriverAssignment.setActive(true);
            currentDriverAssignments.add(newDriverAssignment);
        } else {
            existingAssignment.setActive(true);
        }
    }

    private void deactivateRemovedDriverAssignments(List<DriverAssignment> currentDriverAssignments, Long driver1Id, Long driver2Id, LocalDate startDate, LocalDate endDate) {
        for (DriverAssignment driverAssignment : currentDriverAssignments) {
            boolean isDriver1Removed = driver1Id == null || !driver1Id.equals(driverAssignment.getDriver().getId());
            boolean isDriver2Removed = driver2Id == null || !driver2Id.equals(driverAssignment.getDriver().getId());

            if (isDriver1Removed && isDriver2Removed) {
                driverAssignment.setActive(false);
            }
        }
    }
}
