package me.kepski.transport.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class RepairUpdateDTO {
    @NotEmpty(message = "Brak ID zlecenia naprawy.")
    private Long id;
    @NotEmpty(message = "Proszę podać tytuł.")
    private String title;
    @NotEmpty(message = "Proszę podać szczegóły dotyczące naprawy.")
    private String description;
    @NotNull(message = "Proszę podać ID pojazdu.")
    private Long vehicleId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date repairDate;

    public RepairUpdateDTO() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Date getRepairDate() {
        return repairDate;
    }

    public void setRepairDate(Date repairDate) {
        this.repairDate = repairDate;
    }
}
