import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  Merge,
  AlertTriangle,
} from 'lucide-react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  // Modals / Selected complaint for action
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [rejectionModal, setRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchComplaints();
    fetchTeams();
  }, [status, priority]);

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/complaints', {
        params: { search, status, priority, limit: 50 },
      });
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await API.get('/users/teams');
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: 'VERIFIED' });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/complaints/${selectedComplaint._id}/status`, {
        status: 'REJECTED',
        rejectionReason,
      });
      setRejectionModal(false);
      setRejectionReason('');
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting complaint');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return alert('Select a team');
    try {
      await API.put(`/complaints/${selectedComplaint._id}/assign`, {
        teamId: selectedTeam,
      });
      setAssignModal(false);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning team');
    }
  };

  const handleCloseComplaint = async (id) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: 'COMPLETED' });
      fetchComplaints();
    } catch (err) {
      alert('Error closing complaint');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Verification & Dispatch</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Filter, verify, assign teams, and inspect photographic repair evidence
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search road, ID, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="VERIFIED">Verified</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="WORK IN PROGRESS">In Progress</option>
          <option value="REPAIRED">Repaired</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
          <option value="REOPENED">Reopened</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <button
          onClick={fetchComplaints}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Apply Filters
        </button>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 uppercase text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">ID / Priority</th>
                <th className="px-4 py-3">Road & Area</th>
                <th className="px-4 py-3">Damage Type</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Assigned Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono">
                    <span className="font-bold text-blue-600 block">{c.complaintId}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : c.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {c.priority} ({c.priorityScore})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{c.roadName}</p>
                    <p className="text-[11px] text-gray-400">{c.area}</p>
                    {c.duplicateCount > 0 && (
                      <span className="text-[10px] text-indigo-600 font-semibold block">
                        Reported by {c.duplicateCount + 1} citizens
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{c.damageType}</td>
                  <td className="px-4 py-3">{c.citizen?.name}</td>
                  <td className="px-4 py-3">
                    {c.assignedTeam ? (
                      <span className="font-medium text-slate-800">{c.assignedTeam.teamName}</span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'REPAIRED'
                          ? 'bg-teal-100 text-teal-800'
                          : c.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : c.status === 'ASSIGNED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Link
                      to={`/complaints/${c._id}`}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded font-semibold text-slate-700"
                    >
                      View
                    </Link>

                    {c.status === 'SUBMITTED' && (
                      <>
                        <button
                          onClick={() => handleVerify(c._id)}
                          className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-semibold"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setRejectionModal(true);
                          }}
                          className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {['VERIFIED', 'REOPENED'].includes(c.status) && (
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setAssignModal(true);
                        }}
                        className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded font-semibold"
                      >
                        Assign Team
                      </button>
                    )}

                    {c.status === 'REPAIRED' && (
                      <button
                        onClick={() => handleCloseComplaint(c._id)}
                        className="text-[11px] bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded font-semibold"
                      >
                        Verify & Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Team Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">
              Assign Team to #{selectedComplaint?.complaintId}
            </h3>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Maintenance Team</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.teamName} ({t.assignedArea})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setAssignModal(false)}
                className="px-3 py-1.5 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md"
              >
                Confirm Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">
              Reject Complaint #{selectedComplaint?.complaintId}
            </h3>
            <textarea
              rows={3}
              placeholder="State reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectionModal(false)}
                className="px-3 py-1.5 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-3 py-1.5 bg-rose-600 text-white font-semibold rounded-md"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
