import React, { useState, useEffect } from 'react';
import './index.css';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import ConflictDisplay from './components/ConflictDisplay';
import ScheduleView from './components/ScheduleView';
import ColoringView from './components/ColoringView';
import GanttChart from './components/GanttChart';
import apiService from './services/api';

/**
 * Main App Component
 * Multi-Resource Task Scheduler using Interval Hypergraph
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [coloringSchedule, setColoringSchedule] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('greedy'); // 'greedy' or 'parallel'

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [tasksData, conflictsData, scheduleData, coloringData, metricsData] = await Promise.all([
        apiService.getAllTasks(),
        apiService.getConflicts(),
        apiService.getSchedule(),
        apiService.getColoringSchedule(),
        apiService.getMetrics(),
      ]);

      setTasks(tasksData);
      setConflicts(conflictsData);
      setSchedule(scheduleData);
      setColoringSchedule(coloringData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend server is running on port 8080.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Handle task addition
  const handleTaskAdded = async (task) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      await apiService.addTask(task);
      setSuccessMessage(`Task ${task.taskId} added successfully!`);

      // Refresh data
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to add task: ${err.response?.data?.message || err.message}`);
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      await apiService.deleteTask(taskId);
      setSuccessMessage(`Task ${taskId} deleted successfully!`);

      // Refresh data
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to delete task: ${err.response?.data?.message || err.message}`);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle clear all tasks
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL tasks?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      await apiService.clearAllTasks();
      setSuccessMessage('All tasks cleared successfully!');

      // Refresh data
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to clear tasks: ${err.response?.data?.message || err.message}`);
      console.error('Error clearing tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get scheduled task IDs for highlighting
  const scheduledTaskIds = schedule.map(t => t.taskId);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                Task Scheduler <span className="text-blue-200">Pro</span>
              </h1>
              <p className="text-lg text-blue-100 font-medium opacity-90">
                Advanced DSA • Interval Hypergraph • Conflict Resolution
              </p>
            </div>
            <div className="flex gap-2">
              {/* <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Spring Boot</span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">React</span> */}
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Greedy</span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Coloring</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Alerts */}
        <div className="space-y-3 mb-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex items-center gap-3">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r shadow-sm flex items-center gap-3 animate-pulse">
              <span className="text-xl">✅</span> {successMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Forms and Metrics */}
          <div className="lg:col-span-4 space-y-8">
            <TaskForm onTaskAdded={handleTaskAdded} />

            {metrics && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">System Metrics</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-xl transition-transform hover:scale-105">
                      <div className="text-2xl font-black text-blue-700">{metrics.totalTasks}</div>
                      <div className="text-xs uppercase font-bold text-blue-500 tracking-wider">Total Tasks</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl transition-transform hover:scale-105">
                      <div className="text-2xl font-black text-red-700">{metrics.conflictCount}</div>
                      <div className="text-xs uppercase font-bold text-red-500 tracking-wider">Conflicts</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl transition-transform hover:scale-105">
                      <div className="text-2xl font-black text-green-700">{metrics.scheduledTaskCount}</div>
                      <div className="text-xs uppercase font-bold text-green-500 tracking-wider">Greedy Fit</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl transition-transform hover:scale-105">
                      <div className="text-2xl font-black text-purple-700">{metrics.uniqueResourceCount}</div>
                      <div className="text-xs uppercase font-bold text-purple-500 tracking-wider">Resources</div>
                    </div>
                  </div>

                  {tasks.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="w-full mt-6 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200"
                    >
                      Reset All Data
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Table and Visualization */}
          <div className="lg:col-span-8 space-y-8">
            <TaskTable
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              scheduledTaskIds={scheduledTaskIds}
            />

            <GanttChart
              tasks={tasks}
              scheduledTasks={schedule}
              conflicts={conflicts}
            />

            {/* View Selection Tabs */}
            <div className="bg-white rounded-2xl shadow-xl p-2 border border-blue-100 flex gap-2">
              <button
                onClick={() => setActiveTab('greedy')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'greedy'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span>🎯</span> Greedy Schedule
              </button>
              <button
                onClick={() => setActiveTab('parallel')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'parallel'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span>🌈</span> Parallel Slots
              </button>
            </div>

            {loading && <div className="text-center py-10 text-gray-400 font-medium animate-pulse">Recalculating algorithms...</div>}

            {!loading && activeTab === 'greedy' && (
              <ScheduleView
                scheduledTasks={schedule}
                totalTasks={tasks.length}
                metrics={metrics}
              />
            )}

            {!loading && activeTab === 'parallel' && (
              <ColoringView
                coloringSchedule={coloringSchedule}
                totalTasks={tasks.length}
              />
            )}

            <ConflictDisplay conflicts={conflicts} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20 border-t-8 border-indigo-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Core Architecture</h3>
              <p className="text-gray-400 mb-4 italic">"Leveraging advanced interval hypergraphs for efficient resource management."</p>
              {/* <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {['ArrayList', 'HashMap', 'HashSet', 'PriorityQueue', 'TreeMap'].map(ds => (
                  <span key={ds} className="bg-gray-800 px-3 py-1 rounded text-xs font-mono">{ds}</span>
                ))}
              </div> */}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Optimization Strategies</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• <span className="text-gray-200">Selection:</span> Greedy EFT Algorithm (Max Parallel Fit)</li>
                <li>• <span className="text-gray-200">Partitioning:</span> Welsh-Powell Graph Coloring (Lane Allocation)</li>
                {/* <li>• <span className="text-gray-200">Complexity:</span> O(n log n) Scheduling • O(n²) Coloring</li> */}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            Task Scheduler Pro • Built with Java 17 & React
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
