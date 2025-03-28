package me.kepski.transport.entity;

import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne
    private Employee employee;

    @OneToOne
    private Driver driver;

    private LocalDateTime createdAt;

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, Employee employee) {
        this.token = token;
        this.employee = employee;
        this.createdAt = LocalDateTime.now();
    }

    public PasswordResetToken(String token, Driver driver) {
        this.token = token;
        this.driver = driver;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isExpired() {
        return Duration.between(createdAt, LocalDateTime.now()).toMinutes() > 30;
    }
}


