import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MaintenanceDashboard = () => {
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Repair Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('WORK IN PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/maintenance/tasks');
      setTeam(res.data.team);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('maintenanceRemarks', remarks);
      if (beforeImage) formData.append('beforeRepairImage', beforeImage);
      if (afterImage) formData.append('afterRepairImage', afterImage);

      await API.post(`/maintenance/tasks/${selectedTask._id}/repair`, formData);
      setModalOpen(false);
      setBeforeImage(null);
      setAfterImage(null);
      setRemarks('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating repair task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading maintenance portal...</div>;
  }

  const pendingTasks = tasks.filter((t) => t.status === 'ASSIGNED');
  const inProgressTasks = tasks.filter((t) => t.status === 'WORK IN PROGRESS');
  const completedTasks = tasks.filter((t) => ['REPAIRED', 'COMPLETED'].includes(t.status));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
            Field Unit
          </span>
          <h1 className="text-2xl font-bold mt-1">{team?.teamName}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Operational Zone: <span className="text-gray-200 font-semibold">{team?.assignedArea}</span> &bull; Contact: {team?.contactPhone}
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-amber-600 font-semibold">New Assignments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pendingTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{inProgressTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-emerald-600 font-semibold">Repaired / Completed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{completedTasks.length}</p>
        </div>
      </div>

      {/* Assigned Tasks Grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-800">Assigned Road Works</h2>

        {tasks.length === 0 ? (
          <p className="text-xs text-gray-400">No repair tasks currently assigned to your crew.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border border-gray-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {task.complaintId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mt-1">{task.roadName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-600" /> {task.area}
                  </p>

                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold">Type:</span> {task.damageType} &bull;{' '}
                    <span className="font-semibold">Severity:</span> {task.severity}
                  </div>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 bg-white p-2 rounded border border-gray-100">
                    "{task.description}"
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      task.status === 'REPAIRED'
                        ? 'bg-teal-100 text-teal-800'
                        : task.status === 'WORK IN PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/complaints/${task._id}`}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setStatus(
                          task.status === 'ASSIGNED' ? 'WORK IN PROGRESS' : 'REPAIRED'
                        );
                        setModalOpen(true);
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md"
                    >
                      Update Work
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Repair Evidence Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">
              Update Maintenance Progress for #{selectedTask?.complaintId}
            </h3>

            <form onSubmit={handleRepairSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Status Transition</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="WORK IN PROGRESS">Start / Continue Work In Progress</option>
                  <option value="REPAIRED">Mark as Repaired (Upload Completion Evidence)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Maintenance Engineering Remarks</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of materials used, asphalt compaction, patching dimensions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold mb-1">Before-Repair Inspection Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBeforeImage(e.target.files[0])}
                    className="w-full text-[10px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">After-Repair Completed Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAfterImage(e.target.files[0])}
                    className="w-full text-[10px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Submit Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;
