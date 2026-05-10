import React from 'react';

/**
 * ConflictDisplay Component - Visualize conflicting task pairs
 */
const ConflictDisplay = ({ conflicts }) => {
    if (!conflicts || conflicts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Conflicts</h2>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    ✓ No conflicts detected! All tasks can potentially be scheduled.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Conflicts ({conflicts.length})
            </h2>

            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                ⚠ {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected
            </div>

            <div className="space-y-3">
                {conflicts.map((conflict, index) => (
                    <div
                        key={index}
                        className="border border-red-300 bg-red-50 rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="font-semibold text-gray-900">
                                        {conflict.task1.taskId}
                                    </span>
                                    <span className="text-gray-500">
                                        [{conflict.task1.startTime} - {conflict.task1.endTime}]
                                    </span>
                                    <span className="text-red-600 font-bold">⚡</span>
                                    <span className="font-semibold text-gray-900">
                                        {conflict.task2.taskId}
                                    </span>
                                    <span className="text-gray-500">
                                        [{conflict.task2.startTime} - {conflict.task2.endTime}]
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Conflicting Resources:</span>{' '}
                                    {conflict.conflictingResources.map((resource, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-200 text-red-900 ml-1"
                                        >
                                            {resource}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConflictDisplay;
