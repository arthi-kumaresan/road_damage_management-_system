import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { UserCheck, UserX, Users, Plus, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Team Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    teamName: '',
    teamLeaderId: '',
    contactPhone: '',
    assignedArea: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, tRes] = await API.all([API.get('/users'), API.get('/users/teams')]);
      setUsers(uRes.data || []);
      setTeams(tRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await API.put(`/users/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      alert('Error updating user status');
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/teams', teamForm);
      setShowTeamModal(false);
      setTeamForm({
        teamName: '',
        teamLeaderId: '',
        contactPhone: '',
        assignedArea: '',
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating maintenance team');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading directory...</div>;
  }

  const maintenanceAccounts = users.filter((u) => u.role === 'MAINTENANCE_TEAM');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & Fleet Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage citizen accounts, authority personnel, and maintenance teams
          </p>
        </div>
        <button
          onClick={() => setShowTeamModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register New Maintenance Team
        </button>
      </div>

      {/* Maintenance Teams List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-800">Active Maintenance Fleets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => (
            <div key={t._id} className="border border-gray-200 rounded-lg p-4 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-sm">{t.teamName}</h3>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {t.status}
                </span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">Assigned Zone:</span> {t.assignedArea}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Lead Supervisor:</span> {t.teamLeader?.name}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Hotline:</span> {t.contactPhone}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All Users Directory Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">System Users Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 uppercase text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'MAINTENANCE_TEAM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u._id)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded ${
                        u.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Register Maintenance Unit</h3>
            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Team / Fleet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Sector Paving Squad #2"
                  value={teamForm.teamName}
                  onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Supervisor Account *</label>
                <select
                  required
                  value={teamForm.teamLeaderId}
                  onChange={(e) => setTeamForm({ ...teamForm, teamLeaderId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Maintenance Leader Account</option>
                  {maintenanceAccounts.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Hotline *</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={teamForm.contactPhone}
                  onChange={(e) => setTeamForm({ ...teamForm, contactPhone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Operational Zone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Sector / Industrial Corridor"
                  value={teamForm.assignedArea}
                  onChange={(e) => setTeamForm({ ...teamForm, assignedArea: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-3 py-1.5 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
