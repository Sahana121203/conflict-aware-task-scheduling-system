package com.scheduler.model;

import java.util.HashSet;
import java.util.Objects;

/**
 * ConflictPair - Represents a pair of conflicting tasks
 * 
 * Two tasks conflict if:
 * 1. They share at least one resource (hyperedge overlap)
 * 2. Their time intervals overlap
 */
public class ConflictPair {
    
    private Task task1;
    private Task task2;
    private HashSet<String> conflictingResources;

    public ConflictPair(Task task1, Task task2, HashSet<String> conflictingResources) {
        this.task1 = task1;
        this.task2 = task2;
        this.conflictingResources = conflictingResources;
    }

    public Task getTask1() {
        return task1;
    }

    public Task getTask2() {
        return task2;
    }

    public HashSet<String> getConflictingResources() {
        return conflictingResources;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConflictPair that = (ConflictPair) o;
        // Conflict is symmetric: (A,B) == (B,A)
        return (Objects.equals(task1, that.task1) && Objects.equals(task2, that.task2)) ||
               (Objects.equals(task1, that.task2) && Objects.equals(task2, that.task1));
    }

    @Override
    public int hashCode() {
        // Symmetric hash: hash(A,B) == hash(B,A)
        return Objects.hash(task1) + Objects.hash(task2);
    }

    @Override
    public String toString() {
        return "ConflictPair{" +
                "task1=" + task1.getTaskId() +
                ", task2=" + task2.getTaskId() +
                ", conflictingResources=" + conflictingResources +
                '}';
    }
}
