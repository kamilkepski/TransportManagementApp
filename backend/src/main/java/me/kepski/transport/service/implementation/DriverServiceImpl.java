package me.kepski.transport.service.implementation;

import me.kepski.transport.config.PropertyReader;
import me.kepski.transport.entity.ConfirmationToken;
import me.kepski.transport.entity.Driver;
import me.kepski.transport.entity.DriverAssignment;
import me.kepski.transport.repository.DriverAssignmentRepository;
import me.kepski.transport.repository.DriverRepository;
import me.kepski.transport.service.ConfirmationTokenService;
import me.kepski.transport.service.DriverService;
import me.kepski.transport.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.Duration;
import java.time.ZoneId;
import java.time.temporal.ChronoField;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverAssignmentRepository driverAssignmentRepository;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;
    private final PropertyReader propertyReader;

    public DriverServiceImpl(DriverRepository driverRepository,
                             DriverAssignmentRepository driverAssignmentRepository,
                             ConfirmationTokenService confirmationTokenService,
                             EmailService emailService,
                             PropertyReader propertyReader) {
        this.driverRepository = driverRepository;
        this.driverAssignmentRepository = driverAssignmentRepository;
        this.confirmationTokenService = confirmationTokenService;
        this.emailService = emailService;
        this.propertyReader = propertyReader;
    }

    @Override
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Override
    public Page<Driver> getAllActivatedDriversPage(Pageable pageable) {
        return driverRepository.getAllActivatedDriversPage(pageable);
    }

    @Override
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElse(null);
    }

    @Override
    public Long createDriver(Driver driver) {
        Driver existingDriver = driverRepository.findByEmail(driver.getEmail());
        if (existingDriver != null) {
            throw new IllegalArgumentException("Podany adres email już istnieje.");
        }

        driver.setRole("ROLE_DRIVER");
        driver.setAvailable(true);
        Driver savedDriver = driverRepository.save(driver);

        ConfirmationToken confirmationToken = new ConfirmationToken(driver);
        confirmationTokenService.createConfirmationToken(confirmationToken);

        MimeMessagePreparator preparator = message -> {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED, "UTF-8");
            helper.setFrom("Panel zarządzania <" + propertyReader.getPropertyValue("app.email") + ">");
            helper.setTo(driver.getEmail());
            helper.setSubject("Aktywacja konta kierowcy");
            helper.setText("<p>Aby aktywować Twoje konto kierowcy, kliknij w link: </p>" +
                    "<a href=\"" + propertyReader.getPropertyValue("app.frontend") +
                    "aktywacja?token=" + confirmationToken.getConfirmationToken() +
                    "\">Aktywuj konto</a>", true);
        };

        emailService.sendEmail2(preparator);
        return savedDriver.getId();
    }

    @Override
    public Driver updateDriver(Long id, Driver driverDetails) {
        Optional<Driver> optionalDriver = driverRepository.findById(id);
        if (optionalDriver.isPresent()) {
            Driver existingDriver = optionalDriver.get();
            existingDriver.setFirstName(driverDetails.getFirstName());
            existingDriver.setLastName(driverDetails.getLastName());
            existingDriver.setPhoneNumber(driverDetails.getPhoneNumber());
            existingDriver.setAvailable(driverDetails.isAvailable());
            return driverRepository.save(existingDriver);
        } else {
            throw new RuntimeException("Employee not found with id " + id);
        }
    }

    @Override
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    @Override
    public Driver findByEmail(String email) {
        return driverRepository.findByEmail(email);
    }

    @Override
    public List<Driver> getAllActivatedDrivers() {
        return driverRepository.getAllActivatedDrivers();
    }

    @Override
    public String calculateWorkingHours(Long driverId, int month, int year) {
        List<DriverAssignment> assignments = driverAssignmentRepository.findByDriverIdAndMonth(driverId, month, year);

        long totalSeconds = assignments.stream()
                .filter(a -> a.getEndTime() != null && a.getStartTime() != null)
                .mapToLong(a -> Duration.between(
                        a.getStartTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                        a.getEndTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
                ).getSeconds())
                .sum();

        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        return hours + " godzin, " + minutes + " minut i " + seconds + " sekund";
    }

    @Override
    public Map<String, String> calculateWeeklyAndBiweeklyWorkingHours(Long driverId, int month, int year) {
        List<DriverAssignment> assignments = driverAssignmentRepository.findByDriverIdAndMonth(driverId, month, year);

        Map<Integer, Long> weeklyHours = new HashMap<>();
        Map<Integer, Long> biweeklyHours = new HashMap<>();

        for (DriverAssignment assignment : assignments) {
            if (assignment.getEndTime() != null && assignment.getStartTime() != null) {
                long secondsWorked = Duration.between(
                        assignment.getStartTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                        assignment.getEndTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
                ).getSeconds();

                int weekOfYear = assignment.getStartTime().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .get(ChronoField.ALIGNED_WEEK_OF_YEAR);

                int biweeklyPeriod = (weekOfYear + 1) / 2;

                weeklyHours.put(weekOfYear, weeklyHours.getOrDefault(weekOfYear, 0L) + secondsWorked);

                biweeklyHours.put(biweeklyPeriod, biweeklyHours.getOrDefault(biweeklyPeriod, 0L) + secondsWorked);
            }
        }

        Map<String, String> result = new HashMap<>();

        weeklyHours.forEach((week, totalSeconds) -> {
            long hours = totalSeconds / 3600;
            long minutes = (totalSeconds % 3600) / 60;
            long seconds = totalSeconds % 60;
            if (hours > 56) {
                result.put("Tydzień " + week, "Przekroczono limit: " + hours + " godzin, " + minutes + " minut i " + seconds + " sekund");
            } else {
                result.put("Tydzień " + week, hours + " godzin, " + minutes + " minut i " + seconds + " sekund");
            }
        });

        biweeklyHours.forEach((period, totalSeconds) -> {
            long hours = totalSeconds / 3600;
            long minutes = (totalSeconds % 3600) / 60;
            long seconds = totalSeconds % 60;
            if (hours > 90) {
                result.put("Okres dwutygodniowy " + period, "Przekroczono limit: " + hours + " godzin, " + minutes + " minut i " + seconds + " sekund");
            } else {
                result.put("Okres dwutygodniowy " + period, hours + " godzin, " + minutes + " minut i " + seconds + " sekund");
            }
        });

        return result;
    }

}
