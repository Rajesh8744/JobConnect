package com.example.jobportal.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class JobRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String company;

    private String location;

    private String requiredSkills;

    @NotNull
    private Double salary;
}
