package com.scheduler.service;

import com.scheduler.model.ConflictPair;
import com.scheduler.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * SchedulerService - Core scheduling logic implementing DSA concepts
 * 
 * KEY DATA STRUCTURES:
 * 1. ArrayList<Task> - Stores all tasks (vertices in hypergraph)
 * - O(1) access by index
 * - O(1) amortized append
 * 
 * 2. HashMap<String, HashSet<Task>> - Resource to Tasks mapping (hyperedges)
 * - O(1) average lookup by resource
 * - Each resource maps to set of tasks requiring it
 * - This IS the hypergraph representation
 * 
 * 3. PriorityQueue<Task> - Used in greedy scheduling
 * - O(log n) insertion and removal
 * - Automatically maintains earliest-finish-time ordering
 */
@Service
public class SchedulerService {

    // Core data structures representing the Interval Hypergraph
    private final ArrayList<Task> tasks; // All tasks (vertices)
    private final HashMap<String, HashSet<Task>> resourceToTasksMap; // Hyperedges

    public SchedulerService() {
        this.tasks = new ArrayList<>();
        this.resourceToTasksMap = new HashMap<>();
    }

    /**
     * Add a task to the scheduler
     * Time Complexity: O(r) where r = number of resources in the task
     * Space Complexity: O(r)
     * 
     * Updates both the task list and the hypergraph structure
     */
    public Task addTask(Task task) {
        // Add to task list - O(1) amortized
        tasks.add(task);

        // Update hypergraph: add task to each resource's hyperedge - O(r)
        for (String resource : task.getResources()) {
            resourceToTasksMap
                    .computeIfAbsent(resource, k -> new HashSet<>())
                    .add(task);
        }

        return task;
    }

    /**
     * Remove a task by ID
     * Time Complexity: O(n + r) where n = total tasks, r = resources in removed
     * task
     */
    public boolean removeTask(String taskId) {
        Task taskToRemove = null;

        // Find task - O(n)
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                taskToRemove = task;
                break;
            }
        }

        if (taskToRemove == null) {
            return false;
        }

        // Remove from task list - O(n)
        tasks.remove(taskToRemove);

        // Remove from hypergraph - O(r)
        for (String resource : taskToRemove.getResources()) {
            HashSet<Task> tasksForResource = resourceToTasksMap.get(resource);
            if (tasksForResource != null) {
                tasksForResource.remove(taskToRemove);
                // Clean up empty resource entries
                if (tasksForResource.isEmpty()) {
                    resourceToTasksMap.remove(resource);
                }
            }
        }

        return true;
    }

    /**
     * Get all tasks
     * Time Complexity: O(1)
     */
    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks); // Return defensive copy
    }

    /**
     * ALGORITHM 1: Interval Overlap Detection
     * Time Complexity: O(1)
     * 
     * Two intervals [s1, e1) and [s2, e2) overlap if:
     * s1 < e2 AND s2 < e1
     * 
     * This is a fundamental interval operation used in conflict detection.
     */
    public boolean isOverlapping(Task t1, Task t2) {
        return (t1.getStartTime() < t2.getEndTime()) &&
                (t2.getStartTime() < t1.getEndTime());
    }

    /**
     * ALGORITHM 2: Conflict Detection using Hypergraph
     * Time Complexity: O(R * T_r^2) ≈ O(n log n + conflicts)
     * where:
     * - R = number of unique resources
     * - T_r = average tasks per resource
     * - n = total number of tasks
     * 
     * OPTIMIZATION: Instead of checking all O(n^2) task pairs,
     * we only check pairs that share at least one resource (hyperedge).
     * 
     * WHY HYPERGRAPH?
     * - In a simple graph, edges connect exactly 2 vertices
     * - In a hypergraph, a hyperedge can connect multiple vertices
     * - Here, each resource is a hyperedge connecting all tasks that need it
     * - This naturally groups tasks that can potentially conflict
     * 
     * ALGORITHM:
     * 1. For each resource (hyperedge) in the HashMap
     * 2. Get all tasks connected by this hyperedge
     * 3. Check each pair of tasks for interval overlap
     * 4. If overlap exists, record conflict
     */
    public List<ConflictPair> detectConflicts() {
        List<ConflictPair> conflicts = new ArrayList<>();
        HashSet<ConflictPair> seenConflicts = new HashSet<>(); // Avoid duplicates

        // Iterate through each resource (hyperedge) - O(R)
        for (Map.Entry<String, HashSet<Task>> entry : resourceToTasksMap.entrySet()) {
            String resource = entry.getKey();
            HashSet<Task> tasksForResource = entry.getValue();

            // Convert to list for pair iteration
            List<Task> taskList = new ArrayList<>(tasksForResource);

            // Check all pairs of tasks sharing this resource - O(T_r^2)
            for (int i = 0; i < taskList.size(); i++) {
                for (int j = i + 1; j < taskList.size(); j++) {
                    Task t1 = taskList.get(i);
                    Task t2 = taskList.get(j);

                    // Check interval overlap - O(1)
                    if (isOverlapping(t1, t2)) {
                        // Get all conflicting resources (not just current one)
                        HashSet<String> conflictingResources = t1.getCommonResources(t2);

                        ConflictPair conflict = new ConflictPair(t1, t2, conflictingResources);

                        // Add only if not already seen (symmetric check)
                        if (!seenConflicts.contains(conflict)) {
                            seenConflicts.add(conflict);
                            conflicts.add(conflict);
                        }
                    }
                }
            }
        }

        return conflicts;
    }

    /**
     * ALGORITHM 3: Greedy Scheduling Algorithm
     * Time Complexity: O(n log n)
     * 
     * GOAL: Maximize number of tasks scheduled without resource conflicts
     * 
     * GREEDY STRATEGY: Earliest Finish Time First
     * - Always pick the task that finishes earliest
     * - This leaves maximum room for future tasks
     * - This is optimal for interval scheduling (proven by exchange argument)
     * 
     * WHY PRIORITYQUEUE?
     * - Automatically maintains heap property
     * - O(log n) insertion and removal
     * - Always gives us the earliest-finishing task
     * - Perfect for greedy algorithms
     * 
     * ALGORITHM:
     * 1. Insert all tasks into PriorityQueue (sorted by end time) - O(n log n)
     * 2. While queue is not empty:
     * a. Poll earliest-finishing task - O(log n)
     * b. Check if it conflicts with already scheduled tasks - O(s * r)
     * c. If no conflict, add to schedule
     * 3. Return scheduled tasks
     * 
     * Overall: O(n log n) for queue operations + O(n * s * r) for conflict checks
     * where s = scheduled tasks so far, r = avg resources per task
     * Dominated by O(n log n) in most practical cases
     */
    public List<Task> generateConflictFreeSchedule() {
        // PriorityQueue automatically orders by earliest finish time (compareTo)
        PriorityQueue<Task> taskQueue = new PriorityQueue<>(tasks); // O(n log n)

        List<Task> scheduledTasks = new ArrayList<>();

        // Greedy selection - O(n log n)
        while (!taskQueue.isEmpty()) {
            Task candidate = taskQueue.poll(); // O(log n) - get earliest finishing task

            // Check if candidate conflicts with already scheduled tasks
            if (!hasResourceConflict(candidate, scheduledTasks)) {
                scheduledTasks.add(candidate);
            }
            // If conflict exists, skip this task (greedy choice)
        }

        return scheduledTasks;
    }

    /**
     * ALGORITHM 4: Graph Coloring (Welsh-Powell)
     * Time Complexity: O(n^2 + n log n)
     * 
     * GOAL: Schedule ALL tasks into the minimum number of parallel slots (colors).
     * 
     * This ensures that no two tasks in the same slot have a conflict.
     */
    public Map<Integer, List<Task>> generateColoringSchedule() {
        if (tasks.isEmpty()) {
            return new HashMap<>();
        }

        // 1. Build adjacency list for conflict graph - O(R * T_r^2)
        Map<String, Set<String>> adjacencyList = new HashMap<>();
        List<ConflictPair> conflicts = detectConflicts();

        for (Task task : tasks) {
            adjacencyList.put(task.getTaskId(), new HashSet<>());
        }

        for (ConflictPair conflict : conflicts) {
            adjacencyList.get(conflict.getTask1().getTaskId()).add(conflict.getTask2().getTaskId());
            adjacencyList.get(conflict.getTask2().getTaskId()).add(conflict.getTask1().getTaskId());
        }

        // 2. Sort tasks by degree descending (Welsh-Powell optimization) - O(n log n)
        List<Task> sortedTasks = new ArrayList<>(tasks);
        sortedTasks.sort((t1, t2) -> {
            int d1 = adjacencyList.get(t1.getTaskId()).size();
            int d2 = adjacencyList.get(t2.getTaskId()).size();
            if (d1 != d2)
                return Integer.compare(d2, d1);
            return t1.getTaskId().compareTo(t2.getTaskId()); // Consistency tie-break
        });

        // 3. Greedy color assignment - O(n^2)
        Map<String, Integer> taskToColorMap = new HashMap<>();

        for (Task task : sortedTasks) {
            Set<Integer> neighborColors = new HashSet<>();
            for (String neighborId : adjacencyList.get(task.getTaskId())) {
                if (taskToColorMap.containsKey(neighborId)) {
                    neighborColors.add(taskToColorMap.get(neighborId));
                }
            }

            // Find lowest available color
            int color = 0;
            while (neighborColors.contains(color)) {
                color++;
            }
            taskToColorMap.put(task.getTaskId(), color);
        }

        // 4. Group tasks by color for the response - O(n)
        Map<Integer, List<Task>> coloredSchedule = new TreeMap<>();
        // Grouping tasks by their assigned color
        for (Task task : tasks) {
            int color = taskToColorMap.get(task.getTaskId());
            coloredSchedule.computeIfAbsent(color, k -> new ArrayList<>()).add(task);
        }

        return coloredSchedule;
    }

    /**
     * Check if a task has resource conflict with a list of tasks
     * Time Complexity: O(s * r) where s = size of task list, r = avg resources
     * 
     * A conflict exists if:
     * 1. Tasks share at least one resource (hyperedge overlap)
     * 2. Time intervals overlap
     */
    private boolean hasResourceConflict(Task newTask, List<Task> existingTasks) {
        for (Task existing : existingTasks) {
            // Check if they share any resource - O(r)
            if (newTask.sharesResourceWith(existing)) {
                // Check if time intervals overlap - O(1)
                if (isOverlapping(newTask, existing)) {
                    return true; // Conflict found
                }
            }
        }
        return false; // No conflicts
    }

    /**
     * Calculate scheduling metrics
     * Time Complexity: O(n^2) for conflict detection
     */
    public Map<String, Object> calculateMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Total tasks
        metrics.put("totalTasks", tasks.size());

        // Conflict count
        List<ConflictPair> conflicts = detectConflicts();
        metrics.put("conflictCount", conflicts.size());

        // Scheduled tasks
        List<Task> schedule = generateConflictFreeSchedule();
        metrics.put("scheduledTaskCount", schedule.size());

        // Resource utilization
        double utilization = tasks.isEmpty() ? 0.0 : (double) schedule.size() / tasks.size() * 100.0;
        metrics.put("resourceUtilizationPercent", Math.round(utilization * 100.0) / 100.0);

        // Unique resources
        metrics.put("uniqueResourceCount", resourceToTasksMap.size());

        return metrics;
    }

    /**
     * Clear all tasks (for testing)
     */
    public void clearAll() {
        tasks.clear();
        resourceToTasksMap.clear();
    }
}
