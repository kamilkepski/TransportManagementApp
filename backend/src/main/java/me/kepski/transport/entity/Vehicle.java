package me.kepski.transport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty(message = "Proszę podać numer rejestracyjny pojazdu.")
    @Column(nullable = false)
    private String registrationNumber;

    @NotEmpty(message = "Proszę podać markę pojazdu.")
    @Column(nullable = false)
    private String name;

    private String model;

    @NotNull(message = "Proszę podać rok produkcji pojazdu.")
    @Column(name = "production_year", nullable = false)
    private Integer productionYear;

    @NotNull(message = "Proszę podać liczbę miejsc w pojeździe.")
    @Column(name = "number_of_seats", nullable = false)
    private Integer numberOfSeats;

    @NotEmpty(message = "Proszę wybrać kategorię pojazdu.")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Proszę podać aktualny przebieg pojazdu.")
    @Column(nullable = false)
    private Integer mileage;

    @Column(name = "emission_standard")
    private String emissionStandard;

    @Column(name = "gearbox_type")
    private String gearboxType;

    @Column(name = "number_of_axles")
    private String numberOfAxles;

    private String VIN;

    @Column(name = "technical_inspection")
    @NotNull(message = "Proszę podać datę ważności przeglądu technicznego pojazdu.")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date technicalInspection;

    @Column(name = "fuel")
    private Float fuel;

    @NotNull(message = "Proszę podać pojemność zbiornika paliwa pojazdu.")
    private Integer fuelTankCapacity;

    @JsonIgnore
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Repair> repairs = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "vehicle")
    private List<OrderVehicleAssignment> vehicleAssignments;

    public Vehicle() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getProductionYear() {
        return productionYear;
    }

    public void setProductionYear(Integer productionYear) {
        this.productionYear = productionYear;
    }

    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getEmissionStandard() {
        return emissionStandard;
    }

    public void setEmissionStandard(String emissionStandard) {
        this.emissionStandard = emissionStandard;
    }

    public String getGearboxType() {
        return gearboxType;
    }

    public void setGearboxType(String gearboxType) {
        this.gearboxType = gearboxType;
    }

    public String getNumberOfAxles() {
        return numberOfAxles;
    }

    public void setNumberOfAxles(String numberOfAxles) {
        this.numberOfAxles = numberOfAxles;
    }

    public String getVIN() {
        return VIN;
    }

    public void setVIN(String VIN) {
        this.VIN = VIN;
    }

    public Date getTechnicalInspection() {
        return technicalInspection;
    }

    public void setTechnicalInspection(Date technicalInspection) {
        this.technicalInspection = technicalInspection;
    }

    public Float getFuel() {
        return fuel;
    }

    public void setFuel(Float fuel) {
        this.fuel = fuel;
    }

    public List<Repair> getRepairs() {
        return repairs;
    }

    public void setRepairs(List<Repair> repairs) {
        this.repairs = repairs;
    }

    public List<OrderVehicleAssignment> getVehicleAssignments() {
        return vehicleAssignments;
    }

    public void setVehicleAssignments(List<OrderVehicleAssignment> vehicleAssignments) {
        this.vehicleAssignments = vehicleAssignments;
    }

    public Integer getFuelTankCapacity() {
        return fuelTankCapacity;
    }

    public void setFuelTankCapacity(Integer fuelTankCapacity) {
        this.fuelTankCapacity = fuelTankCapacity;
    }
}
