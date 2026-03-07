package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findBySeeker(User seeker);
    List<JobApplication> findByJob(Job job);
    boolean existsByJobAndSeeker(Job job, User seeker);
}
