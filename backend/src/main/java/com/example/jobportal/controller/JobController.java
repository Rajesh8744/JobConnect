package com.example.jobportal.controller;

import com.example.jobportal.entity.Job;
import com.example.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<?> getJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") Double minSalary,
            @RequestParam(defaultValue = "1000000") Double maxSalary) {
        
        List<Job> jobs;
        if ((title == null || title.isEmpty()) && (location == null || location.isEmpty())) {
            jobs = jobRepository.findByIsActiveTrueOrderByPostedDateDesc();
        } else {
            jobs = jobRepository.searchJobs(
                    title != null ? title : "", 
                    location != null ? location : "", 
                    minSalary, 
                    maxSalary
            );
        }
        return ResponseEntity.ok(jobs.stream().map(this::mapJob).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        Job job = jobRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(mapJob(job));
    }

    private Map<String, Object> mapJob(Job job) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", job.getId());
        map.put("title", job.getTitle());
        map.put("company", job.getCompany());
        map.put("logo", job.getLogo());
        map.put("location", job.getLocation());
        map.put("description", job.getDescription());
        map.put("requirements", job.getRequirements());
        map.put("salaryMin", job.getSalaryMin());
        map.put("salaryMax", job.getSalaryMax());
        map.put("source", job.getSource());
        map.put("sourceUrl", job.getSourceUrl());
        map.put("postedDate", job.getPostedDate());
        return map;
    }
}
