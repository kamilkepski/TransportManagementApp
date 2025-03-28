package me.kepski.transport.service.implementation;

import me.kepski.transport.entity.ConfirmationToken;
import me.kepski.transport.repository.ConfirmationTokenRepository;
import me.kepski.transport.service.ConfirmationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Override
    public List<ConfirmationToken> getAllConfirmationTokens() {
        return confirmationTokenRepository.findAll();
    }

    @Override
    public ConfirmationToken getConfirmationTokenById(Long id) {
        return confirmationTokenRepository.findById(id).orElse(null);
    }

    @Override
    public ConfirmationToken createConfirmationToken(ConfirmationToken confirmationToken) {
        return confirmationTokenRepository.save(confirmationToken);
    }

    @Override
    public ConfirmationToken updateConfirmationToken(Long id, ConfirmationToken confirmationTokenDetails) {
        return null;
    }

    @Override
    public void deleteConfirmationToken(Long id) {
        ConfirmationToken confirmationToken = getConfirmationTokenById(id);
        confirmationTokenRepository.delete(confirmationToken);
    }

    @Override
    public ConfirmationToken findByConfirmationToken(String confirmationToken) {
        return confirmationTokenRepository.findByConfirmationToken(confirmationToken);
    }
}
