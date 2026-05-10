package com.scheduler.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;

/**
 * Task Model - Represents a vertex in the Interval Hypergraph
 * 
 * Data Structure: This class uses HashSet<String> to store resources
 * - HashSet provides O(1) average-case lookup and insertion
 * - Prevents duplicate resources
 * - Efficient for checking resource membership
 * 
 * Implements Comparable for PriorityQueue ordering (greedy algorithm)
 */
public class Task implements Comparable<Task> {

    private String taskId;
    private int startTime;
    private int endTime;
    private HashSet<String> resources; // Hyperedge membership
    private int priority;

    /**
     * Constructor with validation
     * Time Complexity: O(r) where r = number of resources
     */
    public Task(String taskId, int startTime, int endTime, HashSet<String> resources, int priority) {
        if (endTime <= startTime) {
            throw new IllegalArgumentException("End time must be greater than start time");
        }
        if (taskId == null || taskId.trim().isEmpty()) {
            throw new IllegalArgumentException("Task ID cannot be null or empty");
        }
        if (resources == null || resources.isEmpty()) {
            throw new IllegalArgumentException("Task must require at least one resource");
        }

        this.taskId = taskId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.resources = new HashSet<>(resources); // Defensive copy
        this.priority = priority;
    }

    /**
     * Constructor without priority (default to 0)
     */
    public Task(String taskId, int startTime, int endTime, HashSet<String> resources) {
        this(taskId, startTime, endTime, resources, 0);
    }

    /**
     * Constructor accepting Collection (for JSON deserialization)
     * Time Complexity: O(r) where r = number of resources
     */
    public Task(String taskId, int startTime, int endTime, Collection<String> resources, int priority) {
        this(taskId, startTime, endTime, new HashSet<>(resources), priority);
    }

    /**
     * Default constructor (required for JSON deserialization)
     */
    public Task() {
        this.resources = new HashSet<>();
    }

    // Getters
    public String getTaskId() {
        return taskId;
    }

    public int getStartTime() {
        return startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public HashSet<String> getResources() {
        return new HashSet<>(resources); // Return defensive copy
    }

    public int getPriority() {
        return priority;
    }

    // Setters (required for JSON deserialization)
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }

    public void setResources(Collection<String> resources) {
        this.resources = new HashSet<>(resources);
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    /**
     * Compare tasks by earliest finish time (for greedy scheduling)
     * Time Complexity: O(1)
     * 
     * This enables the PriorityQueue to order tasks by earliest end time,
     * which is the key to the greedy scheduling algorithm.
     */
    @Override
    public int compareTo(Task other) {
        // Primary: earliest end time
        int endTimeComparison = Integer.compare(this.endTime, other.endTime);
        if (endTimeComparison != 0) {
            return endTimeComparison;
        }
        // Secondary: earliest start time (tie-breaker)
        int startTimeComparison = Integer.compare(this.startTime, other.startTime);
        if (startTimeComparison != 0) {
            return startTimeComparison;
        }
        // Tertiary: task ID (for consistency)
        return this.taskId.compareTo(other.taskId);
    }

    /**
     * Check if this task shares any resource with another task
     * Time Complexity: O(min(r1, r2)) where r1, r2 are resource counts
     * 
     * Uses HashSet.contains() which is O(1) average case
     */
    public boolean sharesResourceWith(Task other) {
        for (String resource : this.resources) {
            if (other.resources.contains(resource)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get common resources with another task
     * Time Complexity: O(min(r1, r2))
     */
    public HashSet<String> getCommonResources(Task other) {
        HashSet<String> common = new HashSet<>();
        for (String resource : this.resources) {
            if (other.resources.contains(resource)) {
                common.add(resource);
            }
        }
        return common;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Task task = (Task) o;
        return Objects.equals(taskId, task.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(taskId);
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskId='" + taskId + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", resources=" + resources +
                ", priority=" + priority +
                '}';
    }
}
