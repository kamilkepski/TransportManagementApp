package me.kepski.transport.dto;

import java.time.LocalDate;
import java.util.List;

public class OrderUpdateDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private LocalDate date;
    private LocalDate startDate;
    private LocalDate endDate;
    private String time;
    private String startPoint;
    private String destination;
    private String numberOfPassengers;
    private List<AssignmentRequestDTO> assignments;

    public OrderUpdateDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
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

    public List<AssignmentRequestDTO> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<AssignmentRequestDTO> assignments) {
        this.assignments = assignments;
    }
}
