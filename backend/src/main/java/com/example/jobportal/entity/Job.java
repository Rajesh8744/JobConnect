package com.example.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String title;

    private String company;

    private String logo;

    private String location;

    private String description;

    private String requirements;

    private Double salaryMin;
    private Double salaryMax;

    private String source = "ADMIN"; // LINKEDIN, ADMIN, or RECRUITER

    private String sourceUrl;

    @DBRef
    private User postedBy;

    // Recruiter who submitted this job request
    private String recruiterEmail;

    // Approval workflow
    private JobPostStatus status = JobPostStatus.APPROVED;

    private String rejectionReason;

    private LocalDateTime postedDate = LocalDateTime.now();

    private LocalDateTime expiryDate;

    private Boolean isActive = true;
}
