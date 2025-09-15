import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building, TrendingUp, Plus, Search, MoreVertical, Edit, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { University } from '../types';
import { mockFirestore } from '../services/mockFirebase';

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    plan: 'trial'
  });

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const data = await mockFirestore.universities().get();
      setUniversities(data);
    } catch (error) {
      console.error('Error loading universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const universityData = {
        ...newUniversity,
        status: 'trial' as const,
        subscription: {
          plan: newUniversity.plan,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      };
      
      await mockFirestore.universities().add(universityData);
      setShowAddModal(false);
      setNewUniversity({ name: '', domain: '', adminEmail: '', plan: 'trial' });
      loadUniversities();
    } catch (error) {
      console.error('Error adding university:', error);
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university? This action cannot be undone.')) {
      return;
    }
    
    try {
      await mockFirestore.universities().doc(id).delete();
      loadUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  const filteredUniversities = universities.filter(univ =>
    univ.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    univ.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUniversities: universities.length,
    totalStudents: universities.reduce((sum, univ) => sum + univ.studentsCount, 0),
    totalFaculty: universities.reduce((sum, univ) => sum + univ.facultyCount, 0),
    activeSubscriptions: universities.filter(univ => univ.status === 'active').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Universities</p>
              <p className="text-2xl font-bold text-white">{stats.totalUniversities}</p>
            </div>
            <Building className="w-8 h-8 text-red-600" />
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
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Faculty</p>
              <p className="text-2xl font-bold text-white">{stats.totalFaculty.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-white">{stats.activeSubscriptions}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Universities Management */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold">Universities</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-400">University</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Domain</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Faculty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.map((university, index) => (
                <motion.tr
                  key={university.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-800 hover:bg-gray-900/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-white">{university.name}</p>
                      <p className="text-sm text-gray-400">{university.adminEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">@{university.domain}</td>
                  <td className="py-4 px-4 text-gray-300">{university.studentsCount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-300">{university.facultyCount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      university.status === 'active' 
                        ? 'bg-green-900/20 text-green-400 border border-green-600/30'
                        : university.status === 'trial'
                        ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-600/30'
                        : 'bg-red-900/20 text-red-400 border border-red-600/30'
                    }`}>
                      {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{university.subscription.plan}</td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <button 
                        onClick={() => setSelectedUniversity(selectedUniversity?.id === university.id ? null : university)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {selectedUniversity?.id === university.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10"
                        >
                          <button className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-800 rounded-t-lg">
                            <Edit className="w-4 h-4" />
                            <span>Edit University</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteUniversity(university.id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-800 text-red-400 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete University</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add University Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add New University</h3>
            <form onSubmit={handleAddUniversity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">University Name</label>
                <input
                  type="text"
                  value={newUniversity.name}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Domain</label>
                <input
                  type="text"
                  placeholder="university.edu"
                  value={newUniversity.domain}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={newUniversity.adminEmail}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Initial Plan</label>
                <select
                  value={newUniversity.plan}
                  onChange={(e) => setNewUniversity(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="trial">Trial (30 days)</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Add University
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
