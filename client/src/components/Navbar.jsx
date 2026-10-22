import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Bell, ShieldAlert, User, LogOut, CheckCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showBellMenu, setShowBellMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldAlert className="h-8 w-8 text-amber-500" />
              <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                RoadCare Civic
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition">
              About System
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'CITIZEN' && (
                  <>
                    <Link
                      to="/citizen/dashboard"
                      className="text-gray-300 hover:text-white transition text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/citizen/report"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 rounded-md text-sm transition"
                    >
                      Report Damage
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-300 hover:text-white transition text-sm"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/complaints"
                      className="text-gray-300 hover:text-white transition text-sm"
                    >
                      Manage Complaints
                    </Link>
                  </>
                )}

                {user.role === 'MAINTENANCE_TEAM' && (
                  <Link
                    to="/maintenance/dashboard"
                    className="text-gray-300 hover:text-white transition text-sm"
                  >
                    Task Dashboard
                  </Link>
                )}

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowBellMenu(!showBellMenu)}
                    className="relative text-gray-300 hover:text-white p-1 rounded-full focus:outline-none"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showBellMenu && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-2xl py-2 z-50 text-slate-800 border border-gray-100">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <span className="font-semibold text-sm">Notifications</span>
                        <button
                          onClick={markAllRead}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" /> Mark all read
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`p-3 text-xs border-b border-gray-50 ${
                                n.isRead ? 'bg-white' : 'bg-blue-50/50'
                              }`}
                            >
                              <p className="font-medium text-gray-800">{n.message}</p>
                              <span className="text-[10px] text-gray-400">
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile & Logout */}
                <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-200">{user.name}</p>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Sign Out"
                    className="text-gray-400 hover:text-rose-400 transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
