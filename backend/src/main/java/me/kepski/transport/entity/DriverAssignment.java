package me.kepski.transport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "driver_assignment")
public class DriverAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_vehicle_assignment_id")
    private OrderVehicleAssignment orderVehicleAssignment;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    private LocalDate date;
    private int startMileage;
    private Float startFuelLevel;
    private Float endFuelLevel;
    private int endMileage;
    private boolean isWorking;
    private String notes;
    private boolean isEnded;
    private boolean isActive;
    private Float fuelConsumption;

    @ElementCollection
    @CollectionTable(name = "driver_assignment_locations",
            joinColumns = @JoinColumn(name = "driver_assignment_id"))
    private List<LocationData> locations = new ArrayList<>();

    public List<LocationData> getLocations() {
        return locations;
    }

    public void setLocations(List<LocationData> locations) {
        this.locations = locations;
    }

    public void addLocation(LocationData location) {
        this.locations.add(location);
    }

    public DriverAssignment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public OrderVehicleAssignment getOrderVehicleAssignment() {
        return orderVehicleAssignment;
    }

    public void setOrderVehicleAssignment(OrderVehicleAssignment orderVehicleAssignment) {
        this.orderVehicleAssignment = orderVehicleAssignment;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isWorking() {
        return isWorking;
    }

    public void setWorking(boolean working) {
        isWorking = working;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isEnded() {
        return isEnded;
    }

    public void setEnded(boolean ended) {
        isEnded = ended;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getOrderId() {
        return orderVehicleAssignment.getOrder().getId();
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

    public Float getFuelConsumption() {
        return fuelConsumption;
    }

    public void setFuelConsumption(Float fuelConsumption) {
        this.fuelConsumption = fuelConsumption;
    }
}
