package me.kepski.transport.dto;

import me.kepski.transport.entity.DriverAssignment;
import me.kepski.transport.entity.Order;
import me.kepski.transport.entity.OrderVehicleAssignment;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDetailsDTO toOrderDTO(Order order) {
        OrderDetailsDTO dto = new OrderDetailsDTO();
        dto.setId(order.getId());
        dto.setTitle(order.getTitle());
        dto.setName(order.getName());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setStatus(order.getStatus());
        dto.setDate(order.getDate());
        dto.setStartDate(order.getStartDate());
        dto.setEndDate(order.getEndDate());
        dto.setTime(order.getTime());
        dto.setStartPoint(order.getStartPoint());
        dto.setDestination(order.getDestination());
        dto.setNumberOfPassengers(order.getNumberOfPassengers());
        dto.setRoutePoints(order.getRoutePoints());

        List<VehicleWithDriversDTO> vehiclesWithDrivers = order.getVehicleAssignments().stream()
                .map(assignment -> {
                    List<DriverDTO> uniqueDrivers = assignment.getDriverAssignments().stream()
                            .filter(driverAssignment -> driverAssignment.isActive())
                            .map(driverAssignment -> new DriverDTO(
                                    driverAssignment.getDriver().getId(),
                                    driverAssignment.getDriver().getFirstName(),
                                    driverAssignment.getDriver().getLastName()))
                            .distinct()
                            .collect(Collectors.toMap(
                                    DriverDTO::getId,
                                    driver -> driver,
                                    (existing, replacement) -> existing))
                            .values()
                            .stream()
                            .collect(Collectors.toList());

                    if (uniqueDrivers.isEmpty()) {
                        return null;
                    }

                    return new VehicleWithDriversDTO(
                            assignment.getVehicle().getId(),
                            assignment.getVehicle().getRegistrationNumber(),
                            uniqueDrivers
                    );
                })
                .filter(vehicle -> vehicle != null)
                .collect(Collectors.toList());

        dto.setVehicles(vehiclesWithDrivers);

        return dto;
    }

    public static OrderWithDriverAssignmentDTO toOrderWithDriverAssignmentDTO(Order order, Long driverId) {
        OrderWithDriverAssignmentDTO dto = new OrderWithDriverAssignmentDTO();
        dto.setId(order.getId());
        dto.setTitle(order.getTitle());
        dto.setName(order.getName());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setStatus(order.getStatus());
        dto.setDate(order.getDate());
        dto.setStartDate(order.getStartDate());
        dto.setEndDate(order.getEndDate());
        dto.setTime(order.getTime());
        dto.setStartPoint(order.getStartPoint());
        dto.setDestination(order.getDestination());
        dto.setNumberOfPassengers(order.getNumberOfPassengers());
        dto.setRoutePoints(order.getRoutePoints());
        order.getVehicleAssignments().stream()
                .map(va -> toVehicleAssignmentDTO(va, driverId))
                .collect(Collectors.toList());

        return dto;
    }

    private static VehicleAssignmentDTO toVehicleAssignmentDTO(OrderVehicleAssignment va, Long driverId) {
        return new VehicleAssignmentDTO(
                va.getId(),
                va.getDriverAssignments().stream()
                        .filter(da -> da.getDriver().getId().equals(driverId))
                        .map(OrderMapper::toDriverAssignmentDTO)
                        .collect(Collectors.toList())
        );
    }

    private static DriverAssignmentDTO toDriverAssignmentDTO(DriverAssignment da) {
        return new DriverAssignmentDTO(
                da.getId(),
                da.getStartTime(),
                da.getEndTime(),
                da.getDate(),
                da.getStartMileage(),
                da.getEndMileage(),
                da.getStartFuelLevel(),
                da.getEndFuelLevel(),
                da.getNotes(),
                da.getFuelConsumption(),
                da.isActive(),
                da.isWorking(),
                da.getOrderId(),
                da.isEnded()
        );
    }

}
