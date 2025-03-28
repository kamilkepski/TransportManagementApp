package me.kepski.transport.dto;

import me.kepski.transport.entity.Coordinate;
import me.kepski.transport.entity.Status;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class OrderWithDriverAssignmentDTO {
    private Long id;
    private String title;
    private String name;
    private String phoneNumber;
    private Status status;
    private LocalDate date;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime time;
    private String startPoint;
    private String destination;
    private String numberOfPassengers;
    private List<VehicleAssignmentDTO> vehicleAssignments;
    private List<Coordinate> routePoints;

    public OrderWithDriverAssignmentDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(String startPoint) {
        this.startPoint = startPoint;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getNumberOfPassengers() {
        return numberOfPassengers;
    }

    public void setNumberOfPassengers(String numberOfPassengers) {
        this.numberOfPassengers = numberOfPassengers;
    }

    public List<VehicleAssignmentDTO> getVehicleAssignments() {
        return vehicleAssignments;
    }

    public void setVehicleAssignments(List<VehicleAssignmentDTO> vehicleAssignments) {
        this.vehicleAssignments = vehicleAssignments;
    }

    public List<Coordinate> getRoutePoints() {
        return routePoints;
    }

    public void setRoutePoints(List<Coordinate> routePoints) {
        this.routePoints = routePoints;
    }
}
