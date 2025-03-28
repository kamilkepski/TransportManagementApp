package me.kepski.transport.service;

import me.kepski.transport.dto.RepairRequestDTO;
import me.kepski.transport.dto.RepairUpdateDTO;
import me.kepski.transport.entity.Repair;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RepairService {
    List<Repair> getAllRepairs();
    Repair getRepairById(Long id);
    Long createRepair(Long vehicleId, RepairRequestDTO repairRequestDTO);
    void updateRepair(Long id, RepairUpdateDTO repairDetails);
    void deleteRepair(Long id);
    Page<Repair> getRepairsPage(Pageable pageable);
}
