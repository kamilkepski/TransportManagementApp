package me.kepski.transport.service;

import me.kepski.transport.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface DriverService {

    List<Driver> getAllDrivers();
    Page<Driver> getAllActivatedDriversPage(Pageable pageable);
    Driver getDriverById(Long id);
    Long createDriver(Driver driver);
    Driver updateDriver(Long id, Driver driverDetails);
    void deleteDriver(Long id);
    Driver findByEmail(String email);
    List<Driver> getAllActivatedDrivers();
    String calculateWorkingHours(Long driverId, int month, int year);
    Map<String, String> calculateWeeklyAndBiweeklyWorkingHours(Long driverId, int month, int year);
}
