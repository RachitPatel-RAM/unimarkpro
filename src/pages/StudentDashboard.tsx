import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle, Clock, MapPin, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { Session, Attendance } from '../types';
import { mockFirestore } from '../services/mockFirebase';
import PinInput from '../components/PinInput';
import LocationStatus from '../components/LocationStatus';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { location, permissionGranted, isWithinRadius } = useLocation();
  const [sessionCode, setSessionCode] = useState('');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [pinValue, setPinValue] = useState('');
  const [showBiometric, setShowBiometric] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttendanceHistory();
  }, []);

  const loadAttendanceHistory = async () => {
    try {
      const data = await mockFirestore.attendance().where('studentId', '==', user?.id).get();
      setAttendanceHistory(data);
    } catch (error) {
      console.error('Error loading attendance history:', error);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const sessions = await mockFirestore.sessions().where('code', '==', sessionCode).get();
      const session = sessions[0];

      if (!session || !session.isActive) {
        setError('Invalid or expired session code');
        setLoading(false);
        return;
      }

      if (!permissionGranted || !location) {
        setError('Location permission is required to mark attendance');
        setLoading(false);
        return;
      }

      if (!isWithinRadius(session.location.latitude, session.location.longitude, session.radius)) {
        setError('You are not within the required distance from the session location');
        setLoading(false);
        return;
      }

      setCurrentSession(session);
      setShowBiometric(true);
    } catch (error) {
      setError('Failed to verify session code');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    // Simulate biometric authentication
    try {
      if (pinValue.length !== 4) {
        setError('Please enter a 4-digit PIN');
        return;
      }

      // In a real app, this would verify biometrics or PIN
      await markAttendance();
    } catch (error) {
      setError('Authentication failed');
    }
  };

  const markAttendance = async () => {
    if (!currentSession || !user || !location) return;

    try {
      const attendanceData = {
        sessionId: currentSession.id,
        studentId: user.id,
        studentName: user.name,
        timestamp: new Date(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        verified: true
      };

      await mockFirestore.attendance().add(attendanceData);
      
      // Reset form
      setSessionCode('');
      setCurrentSession(null);
      setShowBiometric(false);
      setPinValue('');
      setError('');
      
      // Reload attendance history
      loadAttendanceHistory();
      
      alert('Attendance marked successfully!');
    } catch (error) {
      setError('Failed to mark attendance');
    }
  };

  const resetForm = () => {
    setSessionCode('');
    setCurrentSession(null);
    setShowBiometric(false);
    setPinValue('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          <p className="text-red-400 text-sm">{user?.universityName}</p>
          <p className="text-gray-500 text-sm">{user?.branch} - {user?.class} - {user?.batch}</p>
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

      {/* Mark Attendance Section */}
      <div className="glass-effect rounded-xl p-8 mb-8">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Mark Attendance</h2>
          <p className="text-gray-400 mb-8">Enter the session code provided by your faculty</p>

          {!showBiometric ? (
            /* Code Entry Form */
            <form onSubmit={handleCodeSubmit} className="max-w-md mx-auto">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="mb-6">
                <PinInput
                  length={3}
                  value={sessionCode}
                  onChange={setSessionCode}
                  onComplete={setSessionCode}
                  disabled={loading}
                />
              </div>

              <motion.button
                type="submit"
                disabled={sessionCode.length !== 3 || loading || !permissionGranted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? 'Verifying...' : 'Join Session'}
              </motion.button>
            </form>
          ) : (
            /* Biometric Authentication */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-2">{currentSession?.title}</h3>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentSession?.startTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Within range</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-6">Enter your 4-digit PIN to mark attendance</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4"
                >
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <div className="mb-6">
                <PinInput
                  length={4}
                  value={pinValue}
                  onChange={setPinValue}
                  onComplete={handleBiometricAuth}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBiometricAuth}
                  disabled={pinValue.length !== 4}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Mark Attendance
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Attendance History */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Attendance History</h2>
        
        {attendanceHistory.length > 0 ? (
          <div className="space-y-3">
            {attendanceHistory.slice(0, 10).map((attendance, index) => (
              <motion.div
                key={attendance.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center py-3 px-4 bg-gray-900/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium">Session Attended</p>
                    <p className="text-sm text-gray-400">
                      {attendance.timestamp.toLocaleDateString()} at {attendance.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-green-400">Verified</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Attendance Records</h3>
            <p className="text-gray-500">Your attendance history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
