package me.kepski.transport.controller;

import me.kepski.transport.config.PropertyReader;
import me.kepski.transport.entity.Driver;
import me.kepski.transport.entity.Employee;
import me.kepski.transport.entity.PasswordResetToken;
import me.kepski.transport.repository.PasswordResetTokenRepository;
import me.kepski.transport.service.DriverService;
import me.kepski.transport.service.EmailService;
import me.kepski.transport.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PropertyReader propertyReader;

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Employee employee = employeeService.findByEmail(email);
        Driver driver = driverService.findByEmail(email);

        if (employee == null && driver == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Użytkownik z takim adresem email nie istnieje.");
        }

        PasswordResetToken existingToken = null;

        if (employee != null) {
            existingToken = tokenRepository.findByEmployee(employee);
        } else {
            existingToken = tokenRepository.findByDriver(driver);
        }

        if (existingToken != null) {
            long minutesSinceCreation = Duration.between(existingToken.getCreatedAt(), LocalDateTime.now()).toMinutes();
            if (minutesSinceCreation < 5) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body("Już wysłano link resetujący. Poczekaj kilka minut przed ponowną próbą.");
            }

            tokenRepository.delete(existingToken);
        }

        PasswordResetToken resetToken;
        String recipientEmail;
        if (employee != null) {
            resetToken = new PasswordResetToken(UUID.randomUUID().toString(), employee);
            recipientEmail = employee.getEmail();
        } else {
            resetToken = new PasswordResetToken(UUID.randomUUID().toString(), driver);
            recipientEmail = driver.getEmail();
        }

        tokenRepository.save(resetToken);

        String resetLink = propertyReader.getPropertyValue("app.frontend") + "haslo-ustaw?token=" + resetToken.getToken();

        MimeMessagePreparator preparator = message -> {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED, "UTF-8");
            helper.setFrom("Panel zarządzania <" + propertyReader.getPropertyValue("app.email") + ">");
            helper.setTo(recipientEmail);
            helper.setSubject("Resetowanie hasła");
            helper.setText("Aby zresetować hasło, kliknij w link: "
                    + resetLink);
        };
        emailService.sendEmail2(preparator);

        return ResponseEntity.ok("Link do resetowania hasła został wysłany na Twój adres email.");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null || resetToken.isExpired()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nieprawidłowy lub wygasły token.");
        }

        if (resetToken.getEmployee() != null) {
            Employee employee = resetToken.getEmployee();
            employee.setPassword(passwordEncoder.encode(newPassword));
        } else if (resetToken.getDriver() != null) {
            Driver driver = resetToken.getDriver();
            driver.setPassword(passwordEncoder.encode(newPassword));
        }

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Hasło zostało pomyślnie zmienione.");
    }
}
