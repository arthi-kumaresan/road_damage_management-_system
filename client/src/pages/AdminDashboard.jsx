import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Users,
  AlertOctagon,
  CheckCircle,
  Clock,
  Wrench,
  Search,
  Filter,
  BarChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [roadScores, setRoadScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/analytics/dashboard');
      setData(res.data);
      const roads = await API.get('/analytics/roads');
      setRoadScores(roads.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading admin data...</div>;
  }

  const { summary, charts } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-6 rounded-xl shadow-md gap-4">
        <div>
          <h1 className="text-2xl font-bold">Road Authority Operations Center</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time infrastructure oversight, team dispatching, and quality analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/complaints"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition"
          >
            Manage Complaints
          </Link>
          <Link
            to="/admin/users"
            className="bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 font-semibold text-xs px-4 py-2 rounded-lg transition"
          >
            User & Team Directory
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold">Total Complaints</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{summary?.totalComplaints}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-rose-600 font-semibold">Critical Priority</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">{summary?.criticalComplaints}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-semibold">In Progress Repairs</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{summary?.inProgressComplaints}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-emerald-600 font-semibold">Avg Resolution Time</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{summary?.avgResolutionDays} <span className="text-xs font-normal text-gray-500">Days</span></p>
        </div>
      </div>

      {/* Road Condition Index (Feature #11) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Road Condition Index & Hotspot Analysis
            </h2>
            <p className="text-xs text-gray-400">
              Composite degradation score (0-100) calculated from damage frequency and severity
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono font-bold">
            0-30 Good | 31-60 Moderate | 61-80 Poor | 81-100 Critical
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadScores.length === 0 ? (
            <p className="text-xs text-gray-400 col-span-3">No road condition telemetry available yet.</p>
          ) : (
            roadScores.map((road, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{road.roadName}</h3>
                    <p className="text-xs text-gray-500">{road.area}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      road.conditionStatus === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : road.conditionStatus === 'POOR'
                        ? 'bg-orange-100 text-orange-800'
                        : road.conditionStatus === 'MODERATE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {road.conditionStatus} ({road.score}/100)
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 flex justify-between pt-2 border-t border-gray-200">
                  <span>Reports: {road.totalComplaints}</span>
                  <span>Active: {road.activeComplaints}</span>
                  <span>Critical: {road.criticalSeverityCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Analytics Breakdown Visuals */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Damage Type Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-bold text-gray-800">Damage Classification Metrics</h3>
          <div className="space-y-2">
            {charts?.damageTypeStats?.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{item._id}</span>
                <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-mono">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Hotspots */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-bold text-gray-800">High Risk Area Distribution</h3>
          <div className="space-y-2">
            {charts?.areaStats?.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{item._id}</span>
                <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">
                  {item.count} complaints
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
