import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * API Service for Task Scheduler
 */
const apiService = {
    // Add a new task
    addTask: async (task) => {
        const response = await api.post('/tasks', task);
        return response.data;
    },

    // Get all tasks
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    // Get conflicts
    getConflicts: async () => {
        const response = await api.get('/conflicts');
        return response.data;
    },

    // Get optimized schedule
    getSchedule: async () => {
        const response = await api.get('/schedule');
        return response.data;
    },

    // Get color-partitioned schedule (Graph Coloring)
    getColoringSchedule: async () => {
        const response = await api.get('/schedule/coloring');
        return response.data;
    },

    // Delete a task
    deleteTask: async (taskId) => {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    },

    // Get metrics
    getMetrics: async () => {
        const response = await api.get('/metrics');
        return response.data;
    },

    // Clear all tasks
    clearAllTasks: async () => {
        const response = await api.delete('/tasks');
        return response.data;
    },
};

export default apiService;
