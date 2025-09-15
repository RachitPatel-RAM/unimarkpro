import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UniversityAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">University Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          <p className="text-red-400 text-sm">{user?.universityName}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-12 text-center"
      >
        <GraduationCap className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">University Admin Dashboard</h2>
        <p className="text-gray-400 mb-8">
          Faculty and student management features are being implemented.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="glass-effect rounded-lg p-6">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Faculty Management</h3>
            <p className="text-sm text-gray-400">Create and manage faculty accounts</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6">
            <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Student Management</h3>
            <p className="text-sm text-gray-400">Manage student enrollments</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Course Structure</h3>
            <p className="text-sm text-gray-400">Manage branches, classes, and batches</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversityAdminDashboard;
