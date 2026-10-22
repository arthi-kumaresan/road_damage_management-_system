import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Citizen Feedback Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [reopenComplaint, setReopenComplaint] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await API.get(`/complaints/${id}`);
      setComplaint(data);
      const fb = await API.get(`/feedback/${id}`);
      setFeedbacks(fb.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await API.post(`/feedback/${id}`, {
        rating,
        comment,
        isSatisfied,
        reopenComplaint,
      });
      setFeedbackSuccess('Feedback submitted successfully!');
      fetchComplaint();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading details...</div>;
  }

  if (!complaint) {
    return <div className="p-8 text-center text-sm text-red-500">Complaint not found.</div>;
  }

  const isCitizenOwner = user?.role === 'CITIZEN' && complaint.citizen._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to={
            user?.role === 'ADMIN'
              ? '/admin/complaints'
              : user?.role === 'MAINTENANCE_TEAM'
              ? '/maintenance/dashboard'
              : '/citizen/dashboard'
          }
          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <span className="text-xs font-mono text-gray-400">ID: {complaint.complaintId}</span>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{complaint.roadName}</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                  complaint.priority === 'CRITICAL'
                    ? 'bg-red-100 text-red-800'
                    : complaint.priority === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {complaint.priority} PRIORITY
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> {complaint.area}
              {complaint.latitude && ` (GPS: ${complaint.latitude}, ${complaint.longitude})`}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span
              className={`text-sm px-3 py-1.5 rounded-lg font-bold ${
                complaint.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : complaint.status === 'REPAIRED'
                  ? 'bg-teal-100 text-teal-800'
                  : complaint.status === 'WORK IN PROGRESS'
                  ? 'bg-blue-100 text-blue-800'
                  : complaint.status === 'REJECTED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {complaint.status}
            </span>
            <p className="text-[11px] text-gray-400 mt-1">
              Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Complaint Metrics & Info */}
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-gray-400 block mb-0.5">Damage Classification</span>
            <p className="font-semibold text-gray-800 text-sm">{complaint.damageType}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-gray-400 block mb-0.5">Assigned Maintenance</span>
            <p className="font-semibold text-gray-800 text-sm">
              {complaint.assignedTeam ? complaint.assignedTeam.teamName : 'Unassigned'}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-gray-400 block mb-0.5">Reported By</span>
            <p className="font-semibold text-gray-800 text-sm">{complaint.citizen?.name}</p>
            {complaint.duplicateCount > 0 && (
              <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                + {complaint.duplicateCount} citizen duplicate reports merged
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {complaint.description}
          </p>
        </div>

        {/* Before & After Photo Evidence Comparison */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Repair Photographic Evidence (Before vs After)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-3 bg-slate-50 text-center">
              <span className="text-xs font-bold text-gray-700 block mb-2">
                BEFORE REPAIR (Citizen / Initial Inspection)
              </span>
              <img
                src={
                  complaint.beforeRepairImage
                    ? complaint.beforeRepairImage.startsWith('http')
                      ? complaint.beforeRepairImage
                      : `http://localhost:5000${complaint.beforeRepairImage}`
                    : complaint.images[0]?.startsWith('http')
                    ? complaint.images[0]
                    : `http://localhost:5000${complaint.images[0]}`
                }
                alt="Before repair"
                className="w-full h-56 object-cover rounded-lg border border-gray-200"
              />
            </div>

            <div className="border border-gray-200 rounded-xl p-3 bg-slate-50 text-center">
              <span className="text-xs font-bold text-gray-700 block mb-2">
                AFTER REPAIR (Maintenance Completed Evidence)
              </span>
              {complaint.afterRepairImage ? (
                <img
                  src={
                    complaint.afterRepairImage.startsWith('http')
                      ? complaint.afterRepairImage
                      : `http://localhost:5000${complaint.afterRepairImage}`
                  }
                  alt="After repair"
                  className="w-full h-56 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-56 flex flex-col items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400">
                  <Wrench className="w-8 h-8 mb-2 opacity-50" />
                  <span>Pending maintenance team completion upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Lifecycle Audit Timeline
          </h3>
          <div className="border-l-2 border-blue-500 ml-3 space-y-4 py-2">
            {complaint.timeline.map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
                <p className="text-xs font-bold text-gray-900">{step.status}</p>
                <p className="text-xs text-gray-600">{step.message}</p>
                <span className="text-[10px] text-gray-400">
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Citizen Feedback & Reopen Section */}
        {['REPAIRED', 'COMPLETED'].includes(complaint.status) && isCitizenOwner && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Citizen Quality Inspection & Feedback
            </h3>

            {feedbackSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs mb-3">
                {feedbackSuccess}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rate Resolution Quality (1-5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 text-lg ${
                        rating >= star ? 'text-amber-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Comments & Remarks
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Share feedback on the repair..."
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={reopenComplaint}
                    onChange={(e) => setReopenComplaint(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Reopen complaint (Work incomplete or hazard persists)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submittingFeedback}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-md shadow-sm"
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
