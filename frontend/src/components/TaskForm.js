import React, { useState } from 'react';

/**
 * TaskForm Component - Input form for creating tasks
 */
const TaskForm = ({ onTaskAdded }) => {
    const [formData, setFormData] = useState({
        taskId: '',
        startTime: '',
        endTime: '',
        resources: '',
        priority: '0',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.taskId || !formData.startTime || !formData.endTime || !formData.resources) {
            setError('All fields except priority are required');
            return;
        }

        const startTime = parseInt(formData.startTime);
        const endTime = parseInt(formData.endTime);

        if (endTime <= startTime) {
            setError('End time must be greater than start time');
            return;
        }

        // Parse resources from comma-separated string
        const resourcesArray = formData.resources
            .split(',')
            .map(r => r.trim())
            .filter(r => r.length > 0);

        if (resourcesArray.length === 0) {
            setError('At least one resource is required');
            return;
        }

        // Create task object
        const task = {
            taskId: formData.taskId,
            startTime: startTime,
            endTime: endTime,
            resources: resourcesArray,
            priority: parseInt(formData.priority),
        };

        // Call parent callback
        onTaskAdded(task);

        // Reset form
        setFormData({
            taskId: '',
            startTime: '',
            endTime: '',
            resources: '',
            priority: '0',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Task</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task ID *
                        </label>
                        <input
                            type="text"
                            name="taskId"
                            value={formData.taskId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., T1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resources * (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="resources"
                            value={formData.resources}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., CPU, RAM, GPU"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time *
                        </label>
                        <input
                            type="number"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 0"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time *
                        </label>
                        <input
                            type="number"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority (optional)
                        </label>
                        <input
                            type="number"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                    Add Task
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
