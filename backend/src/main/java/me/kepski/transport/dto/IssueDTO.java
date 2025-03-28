package me.kepski.transport.dto;

import me.kepski.transport.entity.Status;

import java.util.Date;

public class IssueDTO {
    private Long id;
    private String content;
    private Date submissionDate;
    private String response;
    private Date responseDate;
    private Status status;
    private DriverDTO driver;

    public IssueDTO() {
    }

    public IssueDTO(Long id, String content, Date submissionDate, String response, Date responseDate, Status status, DriverDTO driver) {
        this.id = id;
        this.content = content;
        this.submissionDate = submissionDate;
        this.response = response;
        this.responseDate = responseDate;
        this.status = status;
        this.driver = driver;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public Date getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(Date responseDate) {
        this.responseDate = responseDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public DriverDTO getDriver() {
        return driver;
    }

    public void setDriver(DriverDTO driver) {
        this.driver = driver;
    }
}
