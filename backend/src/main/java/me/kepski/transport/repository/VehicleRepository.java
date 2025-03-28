package me.kepski.transport.repository;

import me.kepski.transport.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query(value = "select * from vehicle v order by technical_inspection asc", nativeQuery = true)
    Page<Vehicle> getTechnicalInspectionsASC(Pageable pageable);
    boolean existsByRegistrationNumber(String registrationNumber);
}
