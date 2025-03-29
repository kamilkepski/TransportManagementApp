package me.kepski.transport.controller;

import me.kepski.transport.config.PropertyReader;
import me.kepski.transport.dto.ActiveDriverDto;
import me.kepski.transport.dto.PageResponse;
import me.kepski.transport.dto.PasswordRequest;
import me.kepski.transport.entity.ConfirmationToken;
import me.kepski.transport.entity.Driver;
import me.kepski.transport.service.ConfirmationTokenService;
import me.kepski.transport.service.DriverService;
import me.kepski.transport.service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;
    private final ConfirmationTokenService confirmationTokenService;

    public DriverController(DriverService driverService, ConfirmationTokenService confirmationTokenService) {
        this.driverService = driverService;
        this.confirmationTokenService = confirmationTokenService;
    }

    @GetMapping
    public PageResponse<ActiveDriverDto> getDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Driver> driverPage = driverService.getAllActivatedDriversPage(pageable);
        Page<ActiveDriverDto> driverDtoPage = driverPage.map(ActiveDriverDto::new);

        return new PageResponse<>(driverDtoPage);
    }

    @PostMapping
    public ResponseEntity<Void> addDriver(@RequestBody Driver driver) {
        Long newDriverId = driverService.createDriver(driver);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newDriverId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping
    public ResponseEntity<Void> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        driverService.updateDriver(id, driver);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{driverId}/working-hours")
    public ResponseEntity<String> getWorkingHours(@PathVariable Long driverId, @RequestParam int month, @RequestParam int year) {
        String workingHours = driverService.calculateWorkingHours(driverId, month, year);
        return ResponseEntity.ok(workingHours);
    }

    @GetMapping("/{driverId}/working-hours/limits")
    public ResponseEntity<Map<String, String>> getWorkingHoursLimits(@PathVariable Long driverId, @RequestParam int month, @RequestParam int year) {
        Map<String, String> workingHours = driverService.calculateWeeklyAndBiweeklyWorkingHours(driverId, month, year);
        return ResponseEntity.ok(workingHours);
    }

    @GetMapping("/account/verify")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        ConfirmationToken confirmationToken = confirmationTokenService.findByConfirmationToken(token);

        if (confirmationToken == null || confirmationToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token jest niepoprawny lub wygasł.");
        }

        Driver driver = driverService.findByEmail(confirmationToken.getDriver().getEmail());
        if (driver.isEnabled()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Konto kierowcy zostało już aktywowane.");
        }

        return ResponseEntity.ok("Token jest poprawny.");
    }

    @PostMapping("/account/set-password")
    public ResponseEntity<Void> setPassword(@RequestBody PasswordRequest passwordRequest) {
        driverService.setPassword(passwordRequest);
        return ResponseEntity.noContent().build();
    }
}
