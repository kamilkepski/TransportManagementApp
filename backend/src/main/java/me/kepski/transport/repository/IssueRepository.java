package me.kepski.transport.repository;

import me.kepski.transport.entity.DriverAssignment;
import me.kepski.transport.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    @Query("SELECT da FROM Issue da WHERE da.driver.id = :driverId")
    List<Issue> getAllIssuesByDriverId(@Param("driverId") Long driverId);

}
