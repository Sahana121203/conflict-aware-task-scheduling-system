package com.scheduler.controller;

import com.scheduler.model.ConflictPair;
import com.scheduler.model.Task;
import com.scheduler.service.SchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * TaskController - REST API endpoints for task scheduling
 * 
 * Provides endpoints for:
 * - Task management (add, get, delete)
 * - Conflict detection
 * - Schedule generation
 * - Metrics
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend access
public class TaskController {

    @Autowired
    private SchedulerService schedulerService;

    /**
     * POST /api/tasks - Add a new task
     * Request Body: Task JSON
     * Response: Created task with 201 status
     */
    @PostMapping("/tasks")
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        try {
            Task createdTask = schedulerService.addTask(task);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * GET /api/tasks - Get all tasks
     * Response: List of all tasks
     */
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = schedulerService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    /**
     * GET /api/conflicts - Detect conflicts
     * Response: List of ConflictPair objects
     * 
     * Runs the conflict detection algorithm (O(n log n))
     */
    @GetMapping("/conflicts")
    public ResponseEntity<List<ConflictPair>> detectConflicts() {
        List<ConflictPair> conflicts = schedulerService.detectConflicts();
        return new ResponseEntity<>(conflicts, HttpStatus.OK);
    }

    /**
     * GET /api/schedule - Generate optimized schedule
     * Response: List of scheduled tasks (conflict-free)
     * 
     * Runs the greedy scheduling algorithm (O(n log n))
     */
    @GetMapping("/schedule")
    public ResponseEntity<List<Task>> generateSchedule() {
        List<Task> schedule = schedulerService.generateConflictFreeSchedule();
        return new ResponseEntity<>(schedule, HttpStatus.OK);
    }

    /**
     * GET /api/schedule/coloring - Generate partitioned schedule using Graph
     * Coloring
     * Response: Map of color IDs to lists of tasks (parallel slots)
     * 
     * Runs the Welsh-Powell coloring algorithm (O(n^2))
     */
    @GetMapping("/schedule/coloring")
    public ResponseEntity<Map<Integer, List<Task>>> generateColoringSchedule() {
        Map<Integer, List<Task>> coloringSchedule = schedulerService.generateColoringSchedule();
        return new ResponseEntity<>(coloringSchedule, HttpStatus.OK);
    }

    /**
     * DELETE /api/tasks/{id} - Remove a task
     * Path Variable: taskId
     * Response: 204 No Content if successful, 404 if not found
     */
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") String taskId) {
        boolean removed = schedulerService.removeTask(taskId);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * GET /api/metrics - Get scheduling metrics
     * Response: JSON with metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = schedulerService.calculateMetrics();
        return new ResponseEntity<>(metrics, HttpStatus.OK);
    }

    /**
     * DELETE /api/tasks - Clear all tasks (for testing)
     */
    @DeleteMapping("/tasks")
    public ResponseEntity<Void> clearAllTasks() {
        schedulerService.clearAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
