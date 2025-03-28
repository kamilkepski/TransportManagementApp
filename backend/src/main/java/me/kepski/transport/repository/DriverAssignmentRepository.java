package me.kepski.transport.repository;

import me.kepski.transport.entity.DriverAssignment;
import me.kepski.transport.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DriverAssignmentRepository extends JpaRepository<DriverAssignment, Long> {

    @Query("SELECT ova.order FROM DriverAssignment da JOIN da.orderVehicleAssignment ova WHERE da.driver.id = :driverId")
    List<Order> findOrdersByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT DISTINCT ova.order, ova.order.date FROM DriverAssignment da " +
            "JOIN da.orderVehicleAssignment ova " +
            "WHERE da.driver.id = :driverId " +
            "ORDER BY ova.order.date DESC")
    Page<Order> findOrdersByDriverIdPageable(@Param("driverId") Long driverId, Pageable pageable);

    @Query("SELECT da FROM DriverAssignment da WHERE da.orderVehicleAssignment.order.id = :orderId AND da.driver.id = :driverId AND da.date = :assignmentDate AND da.isActive = true")
    List<DriverAssignment> findByOrderAndDriverIdAndAssignmentDate(Long orderId,
                                                                   Long driverId,
                                                                   LocalDate assignmentDate);

    @Query("SELECT da FROM DriverAssignment da WHERE da.orderVehicleAssignment.order.id = :orderId AND da.driver.id = :driverId")
    List<DriverAssignment> findByOrderAndDriverId(Long orderId,
                                                  Long driverId);

    @Query("SELECT da FROM DriverAssignment da WHERE da.driver.id = :driverId AND da.isActive = true")
    List<DriverAssignment> findByDriverId(Long driverId);

    @Query("SELECT da FROM DriverAssignment da WHERE da.orderVehicleAssignment.order.id = :orderId AND da.isActive = true")
    List<DriverAssignment> findByOrder(Long orderId);

    @Query("SELECT da FROM DriverAssignment da WHERE da.driver.id = :driverId AND da.isActive = true AND FUNCTION('MONTH', da.startTime) = :month AND FUNCTION('YEAR', da.startTime) = :year")
    List<DriverAssignment> findByDriverIdAndMonth(@Param("driverId") Long driverId, @Param("month") int month, @Param("year") int year);
}
