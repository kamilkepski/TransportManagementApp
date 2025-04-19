package me.kepski.transport.repository;

import me.kepski.transport.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query(value = "SELECT * FROM employee WHERE email=?", nativeQuery = true)
    Employee findByEmail(String email);

    boolean existsBy();
}
