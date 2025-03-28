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
    private final EmailService emailService;
    private final PropertyReader propertyReader;

    public DriverController(DriverService driverService,
                            ConfirmationTokenService confirmationTokenService,
                            EmailService emailService,
                            PropertyReader propertyReader) {
        this.driverService = driverService;
        this.confirmationTokenService = confirmationTokenService;
        this.emailService = emailService;
        this.propertyReader = propertyReader;
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
    public ResponseEntity<?> setPassword(@RequestBody PasswordRequest passwordRequest) {
        String token = passwordRequest.getToken();
        String password = passwordRequest.getPassword();

        ConfirmationToken confirmationToken = confirmationTokenService.findByConfirmationToken(token);

        if (confirmationToken == null || confirmationToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token jest niepoprawny lub wygasł.");
        }

        Driver driver = driverService.findByEmail(confirmationToken.getDriver().getEmail());
        if (driver.isEnabled()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Konto kierowcy zostało już aktywowane.");
        }

        if (password == null || password.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Hasło musi zawierać co najmniej 8 znaków.");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(password);
        driver.setPassword(encodedPassword);
        driver.setEnabled(true);
        driverService.createDriver(driver);
        confirmationTokenService.deleteConfirmationToken(confirmationToken.getTokenid());

        MimeMessagePreparator preparator = message -> {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED, "UTF-8");
            helper.setFrom("Panel zarządzania <" + propertyReader.getPropertyValue("app.email") + ">");
            helper.setTo(driver.getEmail());
            helper.setSubject("Aktywacja konta kierowcy");
            helper.setText("Twoje konto kierowcy zostało aktywowane.");
        };

        emailService.sendEmail2(preparator);

        return ResponseEntity.ok("Hasło zostało ustawione pomyślnie. Konto jest aktywne.");
    }
}
