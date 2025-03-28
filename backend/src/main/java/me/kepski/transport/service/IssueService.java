package me.kepski.transport.service;

import me.kepski.transport.dto.IssueDTO;
import me.kepski.transport.entity.Issue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IssueService {
    Issue createIssue(Issue issue);
    Issue getIssueById(Long id);
    Page<IssueDTO> getAllIssues(Pageable pageable);
    Issue updateIssue(Long id, Issue issue);
    void deleteIssue(Long id);
    List<Issue> getAllIssuesByUserId(Long id);
}
