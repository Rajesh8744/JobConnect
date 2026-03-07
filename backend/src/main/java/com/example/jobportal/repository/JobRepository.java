package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    List<Job> findByIsActiveTrueOrderByPostedDateDesc();

    @Query("{ 'isActive': true, " +
           "?0: { $regex: ?0, $options: 'i' }, " + // Simplified for now, will refine if needed
           "?1: { $regex: ?1, $options: 'i' }, " +
           "'salaryMin': { $gte: ?2 }, " +
           "'salaryMax': { $lte: ?3 } }")
    List<Job> searchJobs(String title, String location, Double minSalary, Double maxSalary);

    // MongoDB dynamic query is better handled via MongoTemplate for complex optional filters
    // I will use a more standard method name for simpler filters if needed
}
