package me.kepski.transport.dto;

import java.util.List;

public class VehicleAssignmentDTO {
    private Long id;
    private List<DriverAssignmentDTO> driverAssignments;

    public VehicleAssignmentDTO() {
    }

    public VehicleAssignmentDTO(Long id, List<DriverAssignmentDTO> driverAssignments) {
        this.id = id;
        this.driverAssignments = driverAssignments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<DriverAssignmentDTO> getDriverAssignments() {
        return driverAssignments;
    }

    public void setDriverAssignments(List<DriverAssignmentDTO> driverAssignments) {
        this.driverAssignments = driverAssignments;
    }
}
