package me.kepski.transport.service.implementation;

import jakarta.persistence.EntityNotFoundException;
import me.kepski.transport.dto.RepairRequestDTO;
import me.kepski.transport.dto.RepairUpdateDTO;
import me.kepski.transport.entity.Repair;
import me.kepski.transport.entity.Vehicle;
import me.kepski.transport.repository.RepairRepository;
import me.kepski.transport.service.RepairService;
import me.kepski.transport.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepairServiceImpl implements RepairService {

    private final RepairRepository repairRepository;
    private final VehicleService vehicleService;

    public RepairServiceImpl(RepairRepository repairRepository, VehicleService vehicleService) {
        this.repairRepository = repairRepository;
        this.vehicleService = vehicleService;
    }

    @Override
    public List<Repair> getAllRepairs() {
        return repairRepository.findAll();
    }

    @Override
    public Repair getRepairById(Long id) {
        return repairRepository.findById(id).orElse(null);
    }

    @Override
    public Long createRepair(Long vehicleId, RepairRequestDTO repairRequestDTO) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        if (vehicle == null) {
            throw new EntityNotFoundException("Pojazd o ID " + vehicleId + " nie istnieje");
        }

        Repair repair = new Repair();
        repair.setTitle(repairRequestDTO.getTitle());
        repair.setDescription(repairRequestDTO.getDescription());
        repair.setVehicle(vehicle);
        repair.setRepairDate(repairRequestDTO.getRepairDate());

        Repair savedRepair = repairRepository.save(repair);
        return savedRepair.getId();
    }

    @Override
    public void updateRepair(Long id, RepairUpdateDTO repairDetails) {
        Repair existingRepair = repairRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zlecenie naprawy o ID " + id + "nie istnieje"));

        Vehicle vehicle = vehicleService.getVehicleById(repairDetails.getVehicleId());
        if (vehicle == null) {
            throw new EntityNotFoundException("Pojazd o ID " + repairDetails.getVehicleId() + " nie istnieje");
        }

        existingRepair.setTitle(repairDetails.getTitle());
        existingRepair.setDescription(repairDetails.getDescription());
        existingRepair.setVehicle(vehicle);
        existingRepair.setRepairDate(repairDetails.getRepairDate());
        repairRepository.save(existingRepair);
    }

    @Override
    public void deleteRepair(Long id) {
        Repair repair = getRepairById(id);
        repairRepository.delete(repair);
    }

    @Override
    public Page<Repair> getRepairsPage(Pageable pageable) {
        return repairRepository.findAll(pageable);
    }
}
