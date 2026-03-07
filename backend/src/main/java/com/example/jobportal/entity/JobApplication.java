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
@Document(collection = "applications")
public class JobApplication {

    @Id
    private String id;

    @DBRef
    private Job job;

    @DBRef
    private User seeker;

    private String resumePath;

    private String coverLetter;

    private ApplicationStatus status = ApplicationStatus.PENDING;

    private LocalDateTime appliedDate = LocalDateTime.now();

    private String notes;
}
