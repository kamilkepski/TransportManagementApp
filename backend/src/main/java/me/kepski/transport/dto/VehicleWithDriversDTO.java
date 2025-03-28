package me.kepski.transport.dto;

import java.util.List;

public class VehicleWithDriversDTO {
    private Long vehicleId;
    private String vehicleName;
    private List<DriverDTO> drivers;

    public VehicleWithDriversDTO(Long vehicleId, String vehicleName, List<DriverDTO> drivers) {
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.drivers = drivers;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public List<DriverDTO> getDrivers() {
        return drivers;
    }

    public void setDrivers(List<DriverDTO> drivers) {
        this.drivers = drivers;
    }
}
