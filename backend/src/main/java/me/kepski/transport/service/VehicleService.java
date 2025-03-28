package me.kepski.transport.service;

import me.kepski.transport.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleService {
    List<Vehicle> getAllVehicles();
    Page<Vehicle> getAllVehiclesPage(Pageable pageable);
    Vehicle getVehicleById(Long id);
    void createVehicle(Vehicle vehicle);
    void updateVehicle(Long id, Vehicle vehicleDetails);
    void deleteVehicle(Long id);
    Page<Vehicle> getTechnicalInspectionsASC(int pageNumber, int pageSize);
    Page<Vehicle> findPaginated(int pageNumber, int pageSize);
    Page<Vehicle> getInspectionsPage(Pageable pageable);
}
