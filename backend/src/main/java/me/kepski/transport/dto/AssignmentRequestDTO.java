package me.kepski.transport.dto;

public class AssignmentRequestDTO {
    private Long vehicleId;
    private Long driver1Id;
    private Long driver2Id;

    public AssignmentRequestDTO() {
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getDriver1Id() {
        return driver1Id;
    }

    public void setDriver1Id(Long driver1Id) {
        this.driver1Id = driver1Id;
    }

    public Long getDriver2Id() {
        return driver2Id;
    }

    public void setDriver2Id(Long driver2Id) {
        this.driver2Id = driver2Id;
    }
}
