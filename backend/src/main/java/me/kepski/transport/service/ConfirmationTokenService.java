package me.kepski.transport.service;

import me.kepski.transport.entity.ConfirmationToken;

import java.util.List;

public interface ConfirmationTokenService {

    List<ConfirmationToken> getAllConfirmationTokens();
    ConfirmationToken getConfirmationTokenById(Long id);
    ConfirmationToken createConfirmationToken(ConfirmationToken confirmationToken);
    ConfirmationToken updateConfirmationToken(Long id, ConfirmationToken confirmationTokenDetails);
    void deleteConfirmationToken(Long id);
    ConfirmationToken findByConfirmationToken(String confirmationToken);
}
