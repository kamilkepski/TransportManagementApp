package me.kepski.transport.controller;

import jakarta.validation.Valid;
import me.kepski.transport.dto.RepairRequestDTO;
import me.kepski.transport.dto.RepairUpdateDTO;
import me.kepski.transport.entity.Repair;
import me.kepski.transport.service.RepairService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/repairs")
public class RepairController {

    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping
    public Page<Repair> getRepairs(Pageable pageable) {
        return repairService.getRepairsPage(pageable);
    }

    @PostMapping
    public ResponseEntity<Void> createRepair(@Valid @RequestBody RepairRequestDTO repairRequestDTO) {
        Long newRepairId = repairService.createRepair(repairRequestDTO.getVehicleId(), repairRequestDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newRepairId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateRepair(@PathVariable Long id, @RequestBody RepairUpdateDTO repairUpdateDTO) {
        repairService.updateRepair(id, repairUpdateDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepair(@PathVariable Long id) {
        repairService.deleteRepair(id);
        return ResponseEntity.noContent().build();
    }
}
