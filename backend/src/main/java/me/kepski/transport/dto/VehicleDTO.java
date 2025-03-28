package me.kepski.transport.dto;

public class VehicleDTO {
    private Long id;
    private String registrationNumber;

    public VehicleDTO() {
    }

    public VehicleDTO(Long id, String registrationNumber) {
        this.id = id;
        this.registrationNumber = registrationNumber;
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
}
