import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalReports = complaints.length;
  const pendingReports = complaints.filter((c) =>
    ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED'].includes(c.status)
  ).length;
  const inProgressReports = complaints.filter((c) =>
    ['ASSIGNED', 'WORK IN PROGRESS'].includes(c.status)
  ).length;
  const completedReports = complaints.filter((c) =>
    ['REPAIRED', 'COMPLETED'].includes(c.status)
  ).length;
  const reopenedReports = complaints.filter((c) => c.status === 'REOPENED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Citizen Dashboard &bull; Track and submit road damage complaints
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Report New Damage
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Reported</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-amber-600 font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-medium">Work In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{inProgressReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-emerald-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-rose-600 font-medium">Reopened</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{reopenedReports}</p>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">My Damage Complaints</h2>
          <span className="text-xs text-gray-400">Total: {complaints.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 space-y-3">
            <FileText className="w-8 h-8 mx-auto text-gray-300" />
            <p>You haven't submitted any road damage reports yet.</p>
            <Link
              to="/citizen/report"
              className="inline-block text-blue-600 font-semibold text-xs hover:underline"
            >
              Submit your first report
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Complaint ID</th>
                  <th className="px-6 py-3">Road / Locality</th>
                  <th className="px-6 py-3">Damage Type</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                      {c.complaintId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{c.roadName}</p>
                      <p className="text-xs text-gray-400">{c.area}</p>
                    </td>
                    <td className="px-6 py-4">{c.damageType}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.severity === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : c.severity === 'High'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                          c.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'REPAIRED'
                            ? 'bg-teal-100 text-teal-800'
                            : c.status === 'WORK IN PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md font-medium transition"
                      >
                        Track &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
