package me.kepski.transport.controller;

import me.kepski.transport.config.CustomUserDetails;
import me.kepski.transport.dto.IssueDTO;
import me.kepski.transport.dto.RouteRequestDTO;
import me.kepski.transport.entity.*;
import me.kepski.transport.jwt.UserInfo;
import me.kepski.transport.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
public class ApiController {

    @Autowired
    OrderService orderService;

    @Autowired
    IssueService issueService;

    @Autowired
    VehicleService vehicleService;

    @Autowired
    DriverService driverService;

    @PostMapping("/api/updateRoute/{id}")
    public ResponseEntity<Order> updateOrderRoute(@PathVariable Long id, @RequestBody RouteRequestDTO routePoints) {
        Order updatedOrder = orderService.updateRouteForOrder(id, routePoints);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/api/inspections")
    public Page<Vehicle> getVehiclesInspections(Pageable pageable) {
        return vehicleService.getInspectionsPage(pageable);
    }

    @GetMapping("/api/userinfo")
    public ResponseEntity<?> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String driverFirstName = userDetails.getFirstName();
        return ResponseEntity.ok(new UserInfo(driverFirstName));
    }

    @GetMapping("/api/issues")
    public Page<IssueDTO> getAllIssues(Pageable pageable) {
        return issueService.getAllIssues(pageable);
    }

    @GetMapping("/api/get-issue")
    public List<Issue> getIssueByUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverID = userDetails.getId();

        return issueService.getAllIssuesByUserId(driverID);
    }

    @PostMapping("/api/start-order")
    public ResponseEntity<String> startOrder(@RequestBody StartOrderRequest startOrderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();

        Order order = orderService.getOrderById(startOrderRequest.getOrderId());

        List<DriverAssignment> driverAssignments = orderService.findDriverAssignmentsByOrderAndDriverAndDate(
                order.getId(), driverId, startOrderRequest.getStartDate());

        List<DriverAssignment> driverAssignmentsAll = orderService.findDriverAssignmentsByOrderAndDriver(
                order.getId(), driverId);

        for (DriverAssignment assignment : driverAssignmentsAll) {
            System.out.println(assignment.getDate());
        }

        if (driverAssignments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver assignment not found for this order on the given date.");
        }

        DriverAssignment driverAssignment = driverAssignments.get(0);

        driverAssignment.setStartMileage(startOrderRequest.getOdometerReading());
        driverAssignment.setStartFuelLevel(startOrderRequest.getFuelLevel());
        driverAssignment.getOrderVehicleAssignment().getVehicle().setFuel(startOrderRequest.getFuelLevel()*driverAssignment.getOrderVehicleAssignment().getVehicle().getFuelTankCapacity());
        driverAssignment.getOrderVehicleAssignment().getVehicle().setMileage(startOrderRequest.getOdometerReading());
        LocalDateTime now = LocalDateTime.now();
        Date startTime = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        driverAssignment.setStartTime(startTime);
        driverAssignment.setWorking(true);

        Driver driver = driverService.getDriverById(driverId);
        driver.setAvailable(false);
        driverService.updateDriver(driverId, driver);

        orderService.updateDriverAssignment(driverAssignment.getId(), driverAssignment);

        order.setStatus(Status.W_TRAKCIE_REALIZACJI);
        orderService.updateOrder(startOrderRequest.getOrderId(), order);

        return ResponseEntity.ok("Order started successfully");
    }

    @PostMapping("/api/end-order")
    public ResponseEntity<String> endOrder(@RequestBody StartOrderRequest startOrderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();

        Order order = orderService.getOrderById(startOrderRequest.getOrderId());

        List<DriverAssignment> driverAssignments = orderService.findDriverAssignmentsByOrderAndDriverAndDate(
                order.getId(), driverId, startOrderRequest.getStartDate());

        List<DriverAssignment> driverAssignmentsAll = orderService.findDriverAssignmentsByOrderAndDriver(
                order.getId(), driverId);

        List<DriverAssignment> allDriverAssignmentsOrder = orderService.findByOrder(order.getId());

        for (DriverAssignment assignment : driverAssignmentsAll) {
            System.out.println(assignment.getDate());
        }

        if (driverAssignments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver assignment not found for this order on the given date.");
        }

        DriverAssignment driverAssignment = driverAssignments.get(0);

        driverAssignment.setEndMileage(startOrderRequest.getOdometerReading());
        driverAssignment.setEndFuelLevel(startOrderRequest.getFuelLevel());
        driverAssignment.getOrderVehicleAssignment().getVehicle().setFuel(startOrderRequest.getFuelLevel()*driverAssignment.getOrderVehicleAssignment().getVehicle().getFuelTankCapacity());
        driverAssignment.getOrderVehicleAssignment().getVehicle().setMileage(startOrderRequest.getOdometerReading());
        LocalDateTime now = LocalDateTime.now();
        LocalDate nowDate = LocalDate.now();
        Date currentTime = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        driverAssignment.setEndTime(currentTime);
        driverAssignment.setEnded(true);
        if (driverAssignment.getStartFuelLevel() > driverAssignment.getEndFuelLevel()) {
            Float fuelCons = (driverAssignment.getStartFuelLevel() - driverAssignment.getEndFuelLevel())*driverAssignment.getOrderVehicleAssignment().getVehicle().getFuelTankCapacity();
            Integer dist = driverAssignment.getEndMileage() - driverAssignment.getStartMileage();
            driverAssignment.setFuelConsumption(fuelCons/dist*100);
        } else {
            driverAssignment.setFuelConsumption(null);
        }
        List<LocationData> routeData = startOrderRequest.getRouteData();
        driverAssignment.setLocations(routeData);

        Driver driver = driverService.getDriverById(driverId);
        driver.setAvailable(true);
        driverService.updateDriver(driverId, driver);

        orderService.endDriverAssignment(driverAssignment.getId(), driverAssignment);

        boolean allEnded = allDriverAssignmentsOrder.stream().allMatch(DriverAssignment::isEnded);
        if (allEnded) {
            order.setStatus(Status.ZAKONCZONE);
            orderService.updateOrder(startOrderRequest.getOrderId(), order);
        }

        return ResponseEntity.ok("Order ended successfully");
    }

    @GetMapping("/api/driver-assignments")
    public List<DriverAssignment> getDriverAssignments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();
        return orderService.findDriverAssignmentsByDriver(driverId);
    }

    @PostMapping("/api/new-issue")
    public ResponseEntity<String> createIssue(@RequestBody IssueRequest issueRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long driverId = userDetails.getId();

        Issue issue = new Issue();
        LocalDateTime now = LocalDateTime.now();
        Date currentTime = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        issue.setSubmissionDate(currentTime);
        issue.setContent(issueRequest.getContent());
        issue.setDriver(driverService.getDriverById(driverId));
        issue.setStatus(Status.PRZYJETE);

        issueService.createIssue(issue);

        return ResponseEntity.ok("Issue created successfully");
    }

    @PostMapping("/api/issues")
    public ResponseEntity<String> sendIssueResponse(@RequestBody IssueResponse issueResponse) {
        Issue issue = issueService.getIssueById(issueResponse.getIssueId());
        LocalDateTime now = LocalDateTime.now();
        Date currentTime = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        issue.setResponseDate(currentTime);
        issue.setResponse(issueResponse.getContent());
        issue.setStatus(Status.ZAKONCZONE);

        issueService.updateIssue(issueResponse.getIssueId(), issue);

        return ResponseEntity.ok("Issue response sent successfully");
    }
}

class IssueRequest {
    private String content;

    public String getContent() {
        return content;
    }
}

class IssueResponse {
    private Long issueId;
    private String content;

    public Long getIssueId() {
        return issueId;
    }

    public String getContent() {
        return content;
    }
}

class StartOrderRequest {
    private Long orderId;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;
    private int odometerReading;
    private Float fuelLevel;
    List<LocationData> routeData;

    public Long getOrderId() {
        return orderId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public int getOdometerReading() {
        return odometerReading;
    }

    public Float getFuelLevel() {
        return fuelLevel;
    }

    public List<LocationData> getRouteData() {
        return routeData;
    }
}
