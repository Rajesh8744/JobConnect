package com.example.jobportal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String requiredSkills;
    private Double salary;
    private Long recruiterId;
    private String recruiterName;
    private LocalDateTime postedAt;
}
