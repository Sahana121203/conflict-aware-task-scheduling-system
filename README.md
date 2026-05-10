# Multi-Resource Task Scheduler

A Java-based scheduling system demonstrating advanced **Data Structures and Algorithms** concepts using **Interval Hypergraph** modeling, multi-resource conflict detection, and greedy scheduling optimization.

## 🎯 Project Overview

This project implements a task scheduler that:
- Models tasks and resources as an **Interval Hypergraph**
- Detects resource conflicts efficiently using **HashMap** and **HashSet**
- Generates optimal schedules using a **Greedy Algorithm** with **PriorityQueue**
- Provides a React-based visualization frontend

### Key Features
✅ **No Database** - Pure in-memory storage using Java collections  
✅ **Algorithm-Focused** - Emphasis on time complexity and efficiency  
✅ **Visual Feedback** - Gantt chart timeline with conflict highlighting  
✅ **REST API** - Clean separation between backend and frontend  

---

## 📊 Why Interval Hypergraph?

### Traditional Graph vs Hypergraph

**Simple Graph:**
- An edge connects exactly 2 vertices
- Example: Task A → Task B (one-to-one relationship)

**Hypergraph:**
- A hyperedge can connect multiple vertices
- Example: Resource "CPU" → {Task A, Task B, Task C} (one-to-many relationship)

### Our Implementation

In this scheduler:
- **Vertices** = Tasks (with time intervals)
- **Hyperedges** = Resources (connecting all tasks that need them)

**Advantages:**
1. **Natural Grouping**: Tasks sharing resources are automatically grouped
2. **Efficient Conflict Detection**: Only check tasks connected by the same hyperedge
3. **Avoids O(n²) Comparisons**: Instead of checking all task pairs, we only check pairs sharing resources

### Example

```
Tasks:
- T1: [0-5], Resources: {CPU, RAM}
- T2: [3-8], Resources: {CPU, GPU}
- T3: [6-10], Resources: {RAM, GPU}

Hypergraph Structure:
CPU  → {T1, T2}  ← Only check T1 vs T2 for conflicts
RAM  → {T1, T3}  ← Only check T1 vs T3 for conflicts
GPU  → {T2, T3}  ← Only check T2 vs T3 for conflicts
```

Without hypergraph: Check all pairs (T1-T2, T1-T3, T2-T3) = O(n²)  
With hypergraph: Check only pairs sharing resources = O(R × T_r²) where R = resources, T_r = avg tasks per resource

---

## 🗂️ Data Structure Justification

### 1. **HashMap<String, HashSet<Task>>** - Resource-to-Tasks Mapping

**Purpose**: Represents the hypergraph structure

**Why HashMap?**
- O(1) average-case lookup by resource name
- Efficiently maps each resource to its set of tasks
- Enables quick access to all tasks sharing a resource

**Why HashSet for values?**
- O(1) average-case membership testing
- Prevents duplicate tasks for the same resource
- Efficient iteration over tasks sharing a resource

### 2. **ArrayList<Task>** - Task Storage

**Why ArrayList?**
- O(1) access by index
- O(1) amortized append operation
- Dynamic resizing as tasks are added
- Simple iteration over all tasks

### 3. **HashSet<String>** - Resources per Task

**Why HashSet?**
- O(1) membership testing (checking if task uses a resource)
- Prevents duplicate resources in a single task
- Efficient for finding common resources between tasks

### 4. **PriorityQueue<Task>** - Greedy Scheduling

**Why PriorityQueue?**
- O(log n) insertion and removal
- Automatically maintains heap property
- Always provides earliest-finishing task (via `compareTo`)
- Perfect for greedy algorithms requiring sorted access

**Alternative Considered**: Sorting ArrayList
- Sorting: O(n log n) one-time cost
- PriorityQueue: O(n log n) total for n insertions/removals
- PriorityQueue is more elegant and demonstrates heap usage

---

## ⚙️ Algorithm Analysis

### Algorithm 1: Interval Overlap Detection

**Time Complexity**: **O(1)**

```java
boolean isOverlapping(Task t1, Task t2) {
    return (t1.startTime < t2.endTime) && (t2.startTime < t1.endTime);
}
```

**Explanation**: Two intervals [s1, e1) and [s2, e2) overlap if and only if:
- s1 < e2 (first starts before second ends)
- s2 < e1 (second starts before first ends)

This is a constant-time comparison operation.

---

### Algorithm 2: Conflict Detection

**Time Complexity**: **O(R × T_r² + n)** ≈ **O(n log n)** in practice

```
For each resource R in HashMap:
    Get tasks sharing resource R
    For each pair of tasks (T1, T2):
        If intervals overlap:
            Record conflict
```

**Detailed Analysis**:
- R = number of unique resources
- T_r = average tasks per resource
- For each resource: O(T_r²) to check all pairs
- Total: O(R × T_r²)

**Why not O(n²)?**
- If all tasks shared all resources: R = 1, T_r = n → O(n²)
- In practice: Resources are distributed → T_r << n
- Example: 100 tasks, 10 resources → ~10 tasks/resource → O(10 × 10²) = O(1000) vs O(10000)

**Optimization**: Using HashSet to track seen conflicts prevents duplicates

---

### Algorithm 3: Greedy Scheduling (Earliest Finish Time)

**Time Complexity**: **O(n log n)**

```
1. Insert all tasks into PriorityQueue          → O(n log n)
2. While queue not empty:
   a. Poll earliest-finishing task              → O(log n)
   b. Check conflicts with scheduled tasks      → O(s × r)
   c. If no conflict, add to schedule           → O(1)
```

**Detailed Analysis**:
- Step 1: Building heap from n tasks = O(n log n)
- Step 2: n iterations, each poll = O(log n) → Total: O(n log n)
- Conflict checking: For each task, check against s scheduled tasks (s ≤ n)
  - Each check: O(r) where r = avg resources per task
  - Total: O(n × s × r)

**Dominant Term**: O(n log n) for heap operations

**Why Greedy Works**:
- **Greedy Choice**: Always pick task with earliest finish time
- **Optimal Substructure**: If T is in optimal schedule, removing T leaves optimal schedule for remaining tasks
- **Proof**: Exchange argument (if better solution exists, we can swap to get contradiction)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  TaskForm   │  │  TaskTable   │  │  ConflictDisplay │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐                          │
│  │ScheduleView │  │  GanttChart  │                          │
│  └─────────────┘  └──────────────┘                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              TaskController (REST)                   │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────┴─────────────────────────────────┐   │
│  │            SchedulerService (Algorithms)             │   │
│  │  • ArrayList<Task>                                   │   │
│  │  • HashMap<String, HashSet<Task>>                    │   │
│  │  • Conflict Detection (O(n log n))                   │   │
│  │  • Greedy Scheduling (O(n log n))                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────┴─────────────────────────────────┐   │
│  │              Task & ConflictPair Models              │   │
│  │  • Task (with HashSet<String> resources)             │   │
│  │  • Comparable implementation for PriorityQueue       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Diagram

```
┌─────────────────┐
│  User Input     │
│  (Task Data)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Validation                     │
│  • End time > Start time        │
│  • Required fields present      │
│  • Resources non-empty          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Add to Data Structures         │
│  • ArrayList.add(task)          │
│  • For each resource:           │
│    HashMap.get(resource)        │
│      .add(task)                 │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Build Hypergraph Structure     │
│  Resource → Tasks mapping       │
│  (Automatic via HashMap)        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Conflict Detection Algorithm   │
│  For each resource:             │
│    For each task pair:          │
│      If overlap → conflict      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Greedy Scheduling Algorithm    │
│  1. Build PriorityQueue         │
│  2. Poll earliest finish time   │
│  3. Check conflicts             │
│  4. Add if safe                 │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Return Results                 │
│  • All tasks                    │
│  • Conflicts list               │
│  • Optimized schedule           │
│  • Metrics                      │
└─────────────────────────────────┘
```

---

## 🚀 Setup and Running

### Prerequisites
- **Java 17+**
- **Maven 3.6+**
- **Node.js 16+**
- **npm 8+**

### Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Add a new task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/conflicts` | Detect conflicts |
| GET | `/api/schedule` | Generate optimized schedule |
| DELETE | `/api/tasks/{id}` | Remove a task |
| GET | `/api/metrics` | Get system metrics |
| DELETE | `/api/tasks` | Clear all tasks |

### Example Request

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "T1",
    "startTime": 0,
    "endTime": 5,
    "resources": ["CPU", "RAM"],
    "priority": 1
  }'
```

---

## 🧪 Testing Scenarios

### Scenario 1: No Conflicts

```
T1: [0-3], Resources: {CPU}
T2: [4-7], Resources: {CPU}
T3: [8-10], Resources: {RAM}

Expected: All 3 tasks scheduled (no overlap)
```

### Scenario 2: Simple Conflict

```
T1: [0-5], Resources: {CPU}
T2: [3-8], Resources: {CPU}

Expected: 
- Conflict: T1 ↔ T2 (CPU overlap)
- Schedule: T1 only (earliest finish time)
```

### Scenario 3: Multi-Resource Conflict

```
T1: [0-5], Resources: {CPU, RAM}
T2: [3-8], Resources: {CPU}
T3: [6-10], Resources: {RAM}

Expected:
- Conflict: T1 ↔ T2 (CPU overlap)
- Schedule: T1, T3 (T2 conflicts with T1)
```

---

## 📈 Complexity Summary

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Add Task | O(r) | O(r) |
| Remove Task | O(n + r) | O(1) |
| Interval Overlap | O(1) | O(1) |
| Conflict Detection | O(n log n) | O(conflicts) |
| Greedy Scheduling | O(n log n) | O(n) |

Where:
- n = number of tasks
- r = resources per task
- R = unique resources

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Hypergraph Modeling** - Advanced graph structure for multi-way relationships
2. **HashMap Usage** - Efficient key-value mapping for O(1) lookups
3. **HashSet Usage** - Fast membership testing and duplicate prevention
4. **PriorityQueue** - Heap-based priority management for greedy algorithms
5. **Greedy Algorithms** - Optimal solution through local choices
6. **Time Complexity Analysis** - Understanding Big-O notation in practice
7. **REST API Design** - Clean separation of concerns
8. **React State Management** - Frontend data flow and updates

---

## 📝 Notes

- **No Database**: All data stored in-memory (resets on restart)
- **No Authentication**: Focus on algorithms, not security
- **Visualization Only**: Frontend is for demonstration, not production-grade UI
- **Educational Purpose**: Emphasis on DSA concepts and complexity analysis

---

## 👨‍💻 Author

Multi-Resource Task Scheduler - DSA Focused Implementation

**Technologies**: Java, Spring Boot, React, Tailwind CSS, Recharts

**Focus**: Data Structures, Algorithms, Time Complexity Optimization
