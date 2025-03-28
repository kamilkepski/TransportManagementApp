package me.kepski.transport.service.implementation;

import jakarta.persistence.EntityNotFoundException;
import me.kepski.transport.entity.Vehicle;
import me.kepski.transport.repository.VehicleRepository;
import me.kepski.transport.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Page<Vehicle> getAllVehiclesPage(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }

    @Override
    public void createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new IllegalArgumentException("Pojazd z podanym numerem rejestracyjnym jest już w bazie.");
        }
        vehicleRepository.save(vehicle);
    }

    @Override
    public void updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pojazd o ID " + id + " nie istnieje"));

        existingVehicle.setType(vehicleDetails.getType());
        existingVehicle.setRegistrationNumber(vehicleDetails.getRegistrationNumber());
        existingVehicle.setVIN(vehicleDetails.getVIN());
        existingVehicle.setName(vehicleDetails.getName());
        existingVehicle.setModel(vehicleDetails.getModel());
        existingVehicle.setProductionYear(vehicleDetails.getProductionYear());
        existingVehicle.setNumberOfSeats(vehicleDetails.getNumberOfSeats());
        existingVehicle.setMileage(vehicleDetails.getMileage());
        existingVehicle.setEmissionStandard(vehicleDetails.getEmissionStandard());
        existingVehicle.setGearboxType(vehicleDetails.getGearboxType());
        existingVehicle.setNumberOfAxles(vehicleDetails.getNumberOfAxles());
        existingVehicle.setTechnicalInspection(vehicleDetails.getTechnicalInspection());
        existingVehicle.setFuelTankCapacity(vehicleDetails.getFuelTankCapacity());
        vehicleRepository.save(existingVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pojazd o ID " + id + " nie istnieje"));
        vehicleRepository.delete(vehicle);
    }

    @Override
    public Page<Vehicle> getTechnicalInspectionsASC(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        return vehicleRepository.getTechnicalInspectionsASC(pageable);
    }

    @Override
    public Page<Vehicle> findPaginated(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        return vehicleRepository.findAll(pageable);
    }

    @Override
    public Page<Vehicle> getInspectionsPage(Pageable pageable) {
        return vehicleRepository.getTechnicalInspectionsASC(pageable);
    }
}
