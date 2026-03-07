package com.example.jobportal.controller;

import com.example.jobportal.entity.*;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.LinkedInJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private LinkedInJobService linkedInJobService;
    @Autowired private com.example.jobportal.service.EmailService emailService;

    // --- LinkedIn Import ---
    @GetMapping("/linkedin-feed")
    public ResponseEntity<?> getLinkedInFeed(
            @RequestParam(defaultValue = "software engineer") String keywords,
            @RequestParam(defaultValue = "United States") String location) {
        return ResponseEntity.ok(linkedInJobService.fetchJobs(keywords, location, 15));
    }

    @PostMapping("/jobs/linkedin-import")
    public ResponseEntity<?> importJob(@RequestBody Job job) {
        job.setId(null);
        job.setSource("LINKEDIN");
        job.setPostedDate(LocalDateTime.now());
        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job imported from LinkedIn"));
    }

    // --- Job Management ---
    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        job.setId(null);
        job.setSource("ADMIN");
        job.setPostedDate(LocalDateTime.now());
        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job created successfully"));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable String id, @RequestBody Map<String, Object> jobData) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (jobData.containsKey("title")) job.setTitle((String) jobData.get("title"));
        if (jobData.containsKey("company")) job.setCompany((String) jobData.get("company"));
        if (jobData.containsKey("location")) job.setLocation((String) jobData.get("location"));
        if (jobData.containsKey("description")) job.setDescription((String) jobData.get("description"));
        if (jobData.containsKey("requirements")) job.setRequirements((String) jobData.get("requirements"));
        if (jobData.containsKey("salaryMin")) job.setSalaryMin(Double.valueOf(jobData.get("salaryMin").toString()));
        if (jobData.containsKey("salaryMax")) job.setSalaryMax(Double.valueOf(jobData.get("salaryMax").toString()));
        if (jobData.containsKey("isActive")) job.setIsActive((Boolean) jobData.get("isActive"));

        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job updated successfully"));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {
        jobRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll().stream().map(this::mapJob).collect(Collectors.toList()));
    }

    // --- User Management ---
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow();
        if ("admin@jobconnect.com".equals(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete admin"));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // --- Application Management ---
    @GetMapping("/applications/job/{jobId}")
    public ResponseEntity<?> getApplicationsByJob(@PathVariable String jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        List<JobApplication> apps = applicationRepository.findByJob(job);
        return ResponseEntity.ok(apps.stream().map(this::mapApp).collect(Collectors.toList()));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        JobApplication app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(ApplicationStatus.valueOf(status));
        if (notes != null) app.setNotes(notes);
        applicationRepository.save(app);

        // Send email notification for specific statuses
        if (status.equals("REVIEWED") || status.equals("SHORTLISTED") || status.equals("REJECTED")) {
            emailService.sendApplicationStatusEmail(
                app.getSeeker().getEmail(),
                app.getSeeker().getFullName(),
                app.getJob().getTitle(),
                app.getJob().getCompany(),
                status,
                notes
            );
        }

        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    private Map<String, Object> mapJob(Job job) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", job.getId());
        map.put("title", job.getTitle());
        map.put("company", job.getCompany());
        map.put("location", job.getLocation());
        map.put("source", job.getSource());
        map.put("postedDate", job.getPostedDate());
        return map;
    }

    private Map<String, Object> mapApp(JobApplication app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getId());
        map.put("seekerName", app.getSeeker().getFullName());
        map.put("seekerEmail", app.getSeeker().getEmail());
        map.put("status", app.getStatus());
        map.put("appliedDate", app.getAppliedDate());
        map.put("coverLetter", app.getCoverLetter());
        map.put("notes", app.getNotes());
        return map;
    }
}
