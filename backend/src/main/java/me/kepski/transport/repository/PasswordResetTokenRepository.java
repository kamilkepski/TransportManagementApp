package me.kepski.transport.repository;

import me.kepski.transport.entity.Driver;
import me.kepski.transport.entity.Employee;
import me.kepski.transport.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    @Query("SELECT t FROM PasswordResetToken t WHERE (t.employee.email = :email OR t.driver.email = :email)")
    PasswordResetToken findByUserEmail(@Param("email") String email);
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByEmployee(Employee employee);
    PasswordResetToken findByDriver(Driver driver);

}

