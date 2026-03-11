package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobPostStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    List<Job> findByIsActiveTrueAndStatusOrderByPostedDateDesc(JobPostStatus status);

    List<Job> findByStatusOrderByPostedDateDesc(JobPostStatus status);

    List<Job> findByRecruiterEmailOrderByPostedDateDesc(String recruiterEmail);

    @Query("{ 'isActive': true, 'status': 'APPROVED', " +
           "'title': { $regex: ?0, $options: 'i' }, " +
           "'location': { $regex: ?1, $options: 'i' }, " +
           "'salaryMin': { $gte: ?2 }, " +
           "'salaryMax': { $lte: ?3 } }")
    List<Job> searchJobs(String title, String location, Double minSalary, Double maxSalary);
}
