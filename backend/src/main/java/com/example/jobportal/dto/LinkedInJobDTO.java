package com.example.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkedInJobDTO {
    private String title;
    private String company;
    private String location;
    private String link;
    private String postDate;
}
