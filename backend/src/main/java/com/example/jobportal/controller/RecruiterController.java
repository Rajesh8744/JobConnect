package com.example.jobportal.controller;

import com.example.jobportal.entity.*;
import com.example.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.jobportal.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private EmailService emailService;

    // Submit a job request for admin approval
    @PostMapping("/jobs")
    public ResponseEntity<?> submitJobRequest(@RequestBody Map<String, Object> jobData) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email).orElseThrow();

        Job job = new Job();
        job.setTitle((String) jobData.get("title"));
        job.setCompany(recruiter.getCompanyName() != null ? recruiter.getCompanyName() : (String) jobData.get("company"));
        job.setLocation((String) jobData.get("location"));
        job.setDescription((String) jobData.get("description"));
        job.setRequirements((String) jobData.get("requirements"));
        if (jobData.get("salaryMin") != null) job.setSalaryMin(Double.valueOf(jobData.get("salaryMin").toString()));
        if (jobData.get("salaryMax") != null) job.setSalaryMax(Double.valueOf(jobData.get("salaryMax").toString()));
        job.setSource("RECRUITER");
        job.setRecruiterEmail(email);
        job.setPostedBy(recruiter);
        job.setStatus(JobPostStatus.PENDING);
        job.setIsActive(false); // Not active until approved
        job.setPostedDate(LocalDateTime.now());

        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job request submitted for admin approval"));
    }

    // Get all my job requests
    @GetMapping("/jobs")
    public ResponseEntity<?> getMyJobRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Job> jobs = jobRepository.findByRecruiterEmailOrderByPostedDateDesc(email);
        return ResponseEntity.ok(jobs.stream().map(this::mapJob).collect(Collectors.toList()));
    }

    // Get applications for my approved jobs
    @GetMapping("/applications")
    public ResponseEntity<?> getMyJobApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Job> myJobs = jobRepository.findByRecruiterEmailOrderByPostedDateDesc(email);
        List<Job> approvedJobs = myJobs.stream()
                .filter(j -> j.getStatus() == JobPostStatus.APPROVED)
                .collect(Collectors.toList());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Job job : approvedJobs) {
            List<JobApplication> apps = applicationRepository.findByJob(job);
            for (JobApplication app : apps) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", app.getId());
                map.put("jobId", job.getId());
                map.put("jobTitle", job.getTitle());
                map.put("company", job.getCompany());
                map.put("seekerName", app.getSeeker().getFullName());
                map.put("seekerEmail", app.getSeeker().getEmail());
                map.put("status", app.getStatus());
                map.put("appliedDate", app.getAppliedDate());
                map.put("coverLetter", app.getCoverLetter());
                map.put("notes", app.getNotes());
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }

    // Reply to an applicant (update status and notes)
    @PutMapping("/applications/{id}/reply")
    public ResponseEntity<?> replyToApplicant(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        JobApplication app = applicationRepository.findById(id).orElseThrow();

        // Verify this application belongs to a job posted by this recruiter
        if (!email.equals(app.getJob().getRecruiterEmail())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        }

        ApplicationStatus oldStatus = app.getStatus();

        if (body.containsKey("status")) {
            app.setStatus(ApplicationStatus.valueOf(String.valueOf(body.get("status"))));
        }
        if (body.containsKey("notes")) {
            app.setNotes(String.valueOf(body.get("notes")));
        }
        applicationRepository.save(app);

        ApplicationStatus newStatus = app.getStatus();
        if (newStatus != oldStatus && 
            (newStatus == ApplicationStatus.REJECTED || 
             newStatus == ApplicationStatus.SHORTLISTED || 
             newStatus == ApplicationStatus.REVIEWED)) {
            emailService.sendApplicationStatusEmail(
                email,
                app.getSeeker().getEmail(),
                app.getSeeker().getFullName(),
                app.getJob().getTitle(),
                app.getJob().getCompany(),
                newStatus.name(),
                app.getNotes()
            );
        }

        return ResponseEntity.ok(Map.of("message", "Reply sent to applicant"));
    }

    private Map<String, Object> mapJob(Job job) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", job.getId());
        map.put("title", job.getTitle());
        map.put("company", job.getCompany());
        map.put("location", job.getLocation());
        map.put("description", job.getDescription());
        map.put("requirements", job.getRequirements());
        map.put("salaryMin", job.getSalaryMin());
        map.put("salaryMax", job.getSalaryMax());
        map.put("status", job.getStatus());
        map.put("rejectionReason", job.getRejectionReason());
        map.put("postedDate", job.getPostedDate());
        map.put("isActive", job.getIsActive());
        return map;
    }
}
