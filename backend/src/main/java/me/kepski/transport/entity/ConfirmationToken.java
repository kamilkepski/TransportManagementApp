package me.kepski.transport.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="token")
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="token_id")
    private Long tokenid;

    @Column(name="confirmation_token")
    private String confirmationToken;

    private LocalDateTime expirationDate;

    @OneToOne(targetEntity = Driver.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "driver_id")
    private Driver driver;

    public ConfirmationToken() {
    }

    public ConfirmationToken(Driver driver) {
        this.driver = driver;
        expirationDate = LocalDateTime.now().plusDays(1);
        confirmationToken = UUID.randomUUID().toString();
    }

    public Long getTokenid() {
        return tokenid;
    }

    public void setTokenid(Long tokenid) {
        this.tokenid = tokenid;
    }

    public String getConfirmationToken() {
        return confirmationToken;
    }

    public void setConfirmationToken(String confirmationToken) {
        this.confirmationToken = confirmationToken;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }
}
