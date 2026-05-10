package com.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * TaskSchedulerApplication - Main Spring Boot Application
 * 
 * This application demonstrates:
 * - Interval Hypergraph modeling
 * - Multi-resource conflict detection
 * - Greedy scheduling optimization
 * - Efficient use of Java data structures
 * 
 * NO DATABASE - All data stored in-memory using:
 * - ArrayList
 * - HashMap
 * - HashSet
 * - PriorityQueue
 */
@SpringBootApplication
public class TaskSchedulerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskSchedulerApplication.class, args);
        System.out.println("\n" +
                "========================================\n" +
                "  Multi-Resource Task Scheduler Started\n" +
                "  Port: 8080\n" +
                "  API Base: http://localhost:8080/api\n" +
                "========================================\n");
    }
}
