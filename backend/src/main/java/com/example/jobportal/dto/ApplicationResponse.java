package com.example.jobportal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private Long seekerId;
    private String seekerName;
    private String seekerEmail;
    private String resumeUrl;
    private String coverLetter;
    private String status;
    private LocalDateTime appliedAt;
}
