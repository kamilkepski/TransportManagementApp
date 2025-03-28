package me.kepski.transport.repository;

import me.kepski.transport.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    @Query(value = "SELECT * FROM driver WHERE email=?", nativeQuery = true)
    Driver findByEmail(String email);

    @Query(value = "SELECT * FROM driver WHERE is_enabled=1", nativeQuery = true)
    List<Driver> getAllActivatedDrivers();

    @Query(value = "SELECT * FROM driver WHERE is_enabled=1", nativeQuery = true)
    Page<Driver> getAllActivatedDriversPage(Pageable pageable);
}
