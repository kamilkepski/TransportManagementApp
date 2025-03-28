package me.kepski.transport.service.implementation;

import me.kepski.transport.dto.DriverDTO;
import me.kepski.transport.dto.IssueDTO;
import me.kepski.transport.entity.Driver;
import me.kepski.transport.entity.Issue;
import me.kepski.transport.repository.DriverRepository;
import me.kepski.transport.repository.IssueRepository;
import me.kepski.transport.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Override
    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    @Override
    public Issue getIssueById(Long id) {
        return issueRepository.findById(id).orElse(null);
    }

    @Override
    public Page<IssueDTO> getAllIssues(Pageable pageable) {
        return issueRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    private IssueDTO mapToDTO(Issue issue) {
        Driver driver = driverRepository.findById(issue.getDriver().getId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        DriverDTO driverDTO = new DriverDTO(driver.getId(), driver.getFirstName(), driver.getLastName());

        return new IssueDTO(issue.getId(), issue.getContent(), issue.getSubmissionDate(), issue.getResponse(),
                issue.getResponseDate(), issue.getStatus(), driverDTO);
    }

    @Override
    public Issue updateIssue(Long id, Issue issue) {
        Optional<Issue> existingIssue = issueRepository.findById(id);
        if (existingIssue.isPresent()) {
            Issue issueUpdate = existingIssue.get();
            issueUpdate.setStatus(issue.getStatus());
            issueUpdate.setResponse(issue.getResponse());
            issueUpdate.setResponseDate(issue.getResponseDate());

            return issueRepository.save(issueUpdate);
        } else {
            throw new RuntimeException("Issue not found with id " + id);
        }
    }

    @Override
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    @Override
    public List<Issue> getAllIssuesByUserId(Long id) {
        return issueRepository.getAllIssuesByDriverId(id);
    }
}
