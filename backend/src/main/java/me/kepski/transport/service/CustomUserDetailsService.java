package me.kepski.transport.service;

import me.kepski.transport.config.CustomUserDetails;
import me.kepski.transport.entity.Driver;
import me.kepski.transport.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private DriverService driverService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeService.findByEmail(username);
        if (employee != null) {
            return new CustomUserDetails(
                    employee.getId(),
                    employee.getEmail(),
                    employee.getPassword(),
                    employee.getFirstName(),
                    employee.getLastName(),
                    getAuthorities(employee.getRole())
            );
        }

        Driver driver = driverService.findByEmail(username);
        if (driver != null) {
            return new CustomUserDetails(
                    driver.getId(),
                    driver.getEmail(),
                    driver.getPassword(),
                    driver.getFirstName(),
                    driver.getLastName(),
                    getAuthorities(driver.getRole())
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }
}
