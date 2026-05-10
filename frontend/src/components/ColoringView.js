import React from 'react';

/**
 * ColoringView Component - Show parallel scheduling slots (lanes) based on Graph Coloring
 */
const ColoringView = ({ coloringSchedule, totalTasks }) => {
    if (!coloringSchedule || Object.keys(coloringSchedule).length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Parallel Slots (Graph Coloring)</h2>
                <p className="text-gray-500">No parallel slots generated yet. Add tasks to see the coloring schedule.</p>
            </div>
        );
    }

    const colorEntries = Object.entries(coloringSchedule);
    const totalSlots = colorEntries.length;

    // Common colors for slots/lanes
    const slotColors = [
        'bg-blue-50 border-blue-200 text-blue-800',
        'bg-purple-50 border-purple-200 text-purple-800',
        'bg-indigo-50 border-indigo-200 text-indigo-800',
        'bg-teal-50 border-teal-200 text-teal-800',
        'bg-cyan-50 border-cyan-200 text-cyan-800',
        'bg-rose-50 border-rose-200 text-rose-800',
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Parallel Slots (Graph Coloring Algorithm)
            </h2>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Total Parallel Slots</div>
                    <div className="text-3xl font-bold text-indigo-700">
                        {totalSlots}
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Tasks Scheduled</div>
                    <div className="text-3xl font-bold text-green-700">
                        {totalTasks}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        100% of all tasks included
                    </div>
                </div>
            </div>

            {/* Slots / Lanes Display */}
            <div className="space-y-6">
                {colorEntries.map(([slotId, tasksInSlot], index) => (
                    <div key={slotId} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-bold text-sm">
                                {parseInt(index) + 1}
                            </span>
                            <h3 className="font-bold text-gray-700">Lane {parseInt(index) + 1}</h3>
                            <span className="text-xs text-gray-500 ml-auto">
                                {tasksInSlot.length} tasks in this slot
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {tasksInSlot.map((task) => (
                                <div
                                    key={task.taskId}
                                    className={`border rounded-lg p-3 ${slotColors[index % slotColors.length]}`}
                                >
                                    <div className="font-bold flex justify-between items-start">
                                        <span>{task.taskId}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                            Priority {task.priority}
                                        </span>
                                    </div>
                                    <div className="text-xs mt-1 font-medium">
                                        Time: {task.startTime} → {task.endTime}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {task.resources.map((res, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 bg-white/50 rounded text-[10px] font-bold"
                                            >
                                                {res}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Algorithm Explanation */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Algorithm: Welsh-Powell (Graph Coloring)</h4>
                <p className="text-sm text-gray-600">
                    The Welsh-Powell algorithm assigns colors (slots) to tasks such that no two conflicting tasks share the same color.
                    Unlike the greedy algorithm which skips conflicts, this approach partitions **all tasks** into the minimum number of parallel execution lanes.
                </p>
            </div>
        </div>
    );
};

export default ColoringView;
