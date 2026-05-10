import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * GanttChart Component - Timeline visualization using Recharts
 */
const GanttChart = ({ tasks, scheduledTasks, conflicts }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Timeline Visualization</h2>
                <p className="text-gray-500">No tasks to visualize. Add tasks to see the timeline.</p>
            </div>
        );
    }

    // Get scheduled task IDs for color coding
    const scheduledTaskIds = new Set(scheduledTasks.map(t => t.taskId));

    // Get conflicting task IDs
    const conflictingTaskIds = new Set();
    if (conflicts) {
        conflicts.forEach(conflict => {
            conflictingTaskIds.add(conflict.task1.taskId);
            conflictingTaskIds.add(conflict.task2.taskId);
        });
    }

    // Find max time for chart
    const maxTime = Math.max(...tasks.map(t => t.endTime));

    // Prepare data for Gantt chart
    const chartData = tasks.map(task => ({
        taskId: task.taskId,
        startTime: task.startTime,
        duration: task.endTime - task.startTime,
        endTime: task.endTime,
        resources: task.resources.join(', '),
        isScheduled: scheduledTaskIds.has(task.taskId),
        hasConflict: conflictingTaskIds.has(task.taskId),
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-gray-900">{data.taskId}</p>
                    <p className="text-sm text-gray-600">Start: {data.startTime}</p>
                    <p className="text-sm text-gray-600">End: {data.endTime}</p>
                    <p className="text-sm text-gray-600">Duration: {data.duration}</p>
                    <p className="text-sm text-gray-600">Resources: {data.resources}</p>
                    {data.isScheduled && (
                        <p className="text-sm text-green-600 font-semibold mt-1">✓ Scheduled</p>
                    )}
                    {data.hasConflict && (
                        <p className="text-sm text-red-600 font-semibold mt-1">⚠ Has Conflict</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Timeline Visualization (Gantt Chart)</h2>

            {/* Legend */}
            <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Scheduled (No Conflict)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Has Conflict</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Not Scheduled</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={Math.max(300, tasks.length * 40)}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        domain={[0, maxTime + 1]}
                        label={{ value: 'Time', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="taskId"
                        label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="duration" stackId="a">
                        {chartData.map((entry, index) => {
                            let color = '#9CA3AF'; // Gray - not scheduled
                            if (entry.isScheduled) {
                                color = '#10B981'; // Green - scheduled
                            } else if (entry.hasConflict) {
                                color = '#EF4444'; // Red - has conflict
                            }
                            return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Time axis explanation */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> The chart shows task intervals on a timeline.
                    Green bars indicate tasks selected by the greedy scheduling algorithm.
                    Red bars indicate tasks with resource conflicts.
                </p>
            </div>
        </div>
    );
};

export default GanttChart;
