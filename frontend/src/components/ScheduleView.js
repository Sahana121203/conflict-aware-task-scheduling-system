import React from 'react';

/**
 * ScheduleView Component - Show optimized conflict-free schedule
 */
const ScheduleView = ({ scheduledTasks, totalTasks, metrics }) => {
    if (!scheduledTasks || scheduledTasks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Optimized Schedule</h2>
                <p className="text-gray-500">No tasks scheduled yet. Add tasks to generate a schedule.</p>
            </div>
        );
    }

    const utilizationPercent = metrics?.resourceUtilizationPercent || 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Optimized Schedule (Greedy Algorithm)
            </h2>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Scheduled Tasks</div>
                    <div className="text-3xl font-bold text-green-700">
                        {scheduledTasks.length}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        out of {totalTasks} total tasks
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Resource Utilization</div>
                    <div className="text-3xl font-bold text-blue-700">
                        {utilizationPercent}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        efficiency rate
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Algorithm</div>
                    <div className="text-lg font-bold text-purple-700">
                        Greedy (EFT)
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        O(n log n) complexity
                    </div>
                </div>
            </div>

            {/* Scheduled Tasks List */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 mb-3">Scheduled Tasks:</h3>
                {scheduledTasks.map((task, index) => (
                    <div
                        key={task.taskId}
                        className="border border-green-300 bg-green-50 rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </span>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {task.taskId}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Time: {task.startTime} → {task.endTime} (Duration: {task.endTime - task.startTime})
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {task.resources.map((resource, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-200 text-green-900"
                                    >
                                        {resource}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Algorithm Explanation */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Algorithm: Earliest Finish Time (EFT)</h4>
                <p className="text-sm text-gray-600">
                    The greedy scheduling algorithm uses a PriorityQueue to select tasks with the earliest finish time first.
                    This maximizes the number of tasks that can be scheduled without resource conflicts.
                </p>
            </div>
        </div>
    );
};

export default ScheduleView;
