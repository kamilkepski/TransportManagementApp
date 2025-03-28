package me.kepski.transport.dto;

import java.time.LocalDate;
import java.util.Date;

public class DriverAssignmentDTO {
    private Long id;
    private Date startTime;
    private Date endTime;
    private LocalDate date;
    private int startMileage;
    private int endMileage;
    private Float startFuelLevel;
    private Float endFuelLevel;
    private String notes;
    private Float fuelConsumption;
    private boolean active;
    private boolean working;
    private Long orderId;
    private boolean ended;

    public DriverAssignmentDTO() {
    }

    public DriverAssignmentDTO(Long id, Date startTime, Date endTime, LocalDate date, int startMileage, int endMileage, Float startFuelLevel, Float endFuelLevel, String notes, Float fuelConsumption, boolean active, boolean working, Long orderId, boolean ended) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
        this.startMileage = startMileage;
        this.endMileage = endMileage;
        this.startFuelLevel = startFuelLevel;
        this.endFuelLevel = endFuelLevel;
        this.notes = notes;
        this.fuelConsumption = fuelConsumption;
        this.active = active;
        this.working = working;
        this.orderId = orderId;
        this.ended = ended;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getStartMileage() {
        return startMileage;
    }

    public void setStartMileage(int startMileage) {
        this.startMileage = startMileage;
    }

    public int getEndMileage() {
        return endMileage;
    }

    public void setEndMileage(int endMileage) {
        this.endMileage = endMileage;
    }

    public Float getStartFuelLevel() {
        return startFuelLevel;
    }

    public void setStartFuelLevel(Float startFuelLevel) {
        this.startFuelLevel = startFuelLevel;
    }

    public Float getEndFuelLevel() {
        return endFuelLevel;
    }

    public void setEndFuelLevel(Float endFuelLevel) {
        this.endFuelLevel = endFuelLevel;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Float getFuelConsumption() {
        return fuelConsumption;
    }

    public void setFuelConsumption(Float fuelConsumption) {
        this.fuelConsumption = fuelConsumption;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isWorking() {
        return working;
    }

    public void setWorking(boolean working) {
        this.working = working;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public boolean isEnded() {
        return ended;
    }

    public void setEnded(boolean ended) {
        this.ended = ended;
    }
}
