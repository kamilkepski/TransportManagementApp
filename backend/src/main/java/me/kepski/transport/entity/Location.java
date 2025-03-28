package me.kepski.transport.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = true)
    private double accuracy;

    @Column(nullable = true)
    private double speed;

    @Column(nullable = false, name = "timestamp")
    private Instant timestamp;

    @ManyToOne
    @JoinColumn(name = "driver_assignment_id", nullable = false)
    private DriverAssignment driverAssignment;

    public Location() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public DriverAssignment getDriverAssignment() {
        return driverAssignment;
    }

    public void setDriverAssignment(DriverAssignment driverAssignment) {
        this.driverAssignment = driverAssignment;
    }
}
