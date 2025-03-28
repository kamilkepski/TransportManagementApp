package me.kepski.transport.repository;

import me.kepski.transport.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    @Query(value = "SELECT * FROM token WHERE confirmation_token=?", nativeQuery = true)
    ConfirmationToken findByConfirmationToken(String confirmationToken);
}
