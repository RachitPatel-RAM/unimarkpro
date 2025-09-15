import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Clock, Plus, QrCode, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { Session } from '../types';
import { mockFirestore, generateSessionCode } from '../services/mockFirebase';
import LocationStatus from '../components/LocationStatus';

const FacultyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { location, permissionGranted } = useLocation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    branches: ['Computer Engineering'],
    classes: ['B.Tech'],
    batches: ['2022-2026'],
    duration: 2
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await mockFirestore.sessions().get(user?.universityId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!permissionGranted || !location) {
      alert('Location permission is required to create sessions');
      return;
    }

    try {
      const code = generateSessionCode();
      const sessionData = {
        facultyId: user!.id,
        facultyName: user!.name,
        universityId: user!.universityId!,
        code,
        title: newSession.title,
        branches: newSession.branches,
        classes: newSession.classes,
        batches: newSession.batches,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        radius: 500,
        startTime: new Date(),
        endTime: new Date(Date.now() + newSession.duration * 60 * 60 * 1000),
        isActive: true,
        attendanceCount: 0
      };

      await mockFirestore.sessions().add(sessionData);
      setGeneratedCode(code);
      setShowCreateModal(false);
      setShowCodeModal(true);
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const activeSessions = sessions.filter(session => session.isActive);
  const pastSessions = sessions.filter(session => !session.isActive);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          <p className="text-red-400 text-sm">{user?.universityName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <LocationStatus />
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{activeSessions.length}</p>
            </div>
            <QrCode className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{sessions.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Attendance</p>
              <p className="text-2xl font-bold text-white">
                {sessions.reduce((sum, session) => sum + session.attendanceCount, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Active Sessions */}
      <div className="glass-effect rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Active Sessions</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!permissionGranted}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>

        {activeSessions.length > 0 ? (
          <div className="grid gap-4">
            {activeSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{session.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.startTime.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{session.attendanceCount} attended</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{session.radius}m radius</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-600/30">
                        {session.branches.join(', ')} - {session.classes.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold font-mono bg-gray-800 px-3 py-1 rounded">
                        {showCode ? session.code : '***'}
                      </span>
                      <button
                        onClick={() => setShowCode(!showCode)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Session Code</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Active Sessions</h3>
            <p className="text-gray-500">Create a new session to start taking attendance</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Recent Sessions</h2>
        {pastSessions.length > 0 ? (
          <div className="space-y-3">
            {pastSessions.slice(0, 5).map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center py-3 px-4 bg-gray-900/30 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-gray-400">
                    {session.startTime.toLocaleDateString()} • {session.attendanceCount} students
                  </p>
                </div>
                <span className="text-sm text-gray-500">{session.code}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No past sessions</p>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Create New Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                  placeholder="e.g., Data Structures & Algorithms"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duration (hours)</label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                </select>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Create Session
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Generated Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-8 w-full max-w-md text-center"
          >
            <QrCode className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Session Created!</h3>
            <p className="text-gray-400 mb-6">Share this code with your students:</p>
            
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold font-mono text-red-600 mb-2">
                {generatedCode}
              </div>
              <p className="text-sm text-gray-400">Session Code</p>
            </div>

            <button
              onClick={() => setShowCodeModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
