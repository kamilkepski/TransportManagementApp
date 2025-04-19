package me.kepski.transport.service.implementation;

import me.kepski.transport.entity.Employee;
import me.kepski.transport.repository.EmployeeRepository;
import me.kepski.transport.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Long createEmployee(Employee employee) {
        Employee existingEmployee = employeeRepository.findByEmail(employee.getEmail());
        if (existingEmployee != null) {
            throw new IllegalArgumentException("Podany adres email już istnieje.");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(employee.getPassword());
        employee.setPassword(encodedPassword);
        employee.setRole("ROLE_ADMIN");
        Employee savedEmployee = employeeRepository.save(employee);
        return savedEmployee.getId();
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        return null;
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    @Override
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @Override
    public boolean isEmployee() {
        return employeeRepository.existsBy();
    }
}
