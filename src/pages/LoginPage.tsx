import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Users, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      type: 'super-admin' as UserRole,
      title: 'Super Admin',
      description: 'Manage universities and system configuration',
      icon: Shield,
      color: 'from-red-600 to-red-800'
    },
    {
      type: 'university-admin' as UserRole,
      title: 'University Admin',
      description: 'Manage faculty, students, and university settings',
      icon: GraduationCap,
      color: 'from-blue-600 to-blue-800'
    },
    {
      type: 'faculty' as UserRole,
      title: 'Faculty',
      description: 'Create sessions and manage attendance',
      icon: Users,
      color: 'from-green-600 to-green-800'
    },
    {
      type: 'student' as UserRole,
      title: 'Student',
      description: 'Mark attendance and view records',
      icon: UserCheck,
      color: 'from-purple-600 to-purple-800'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setCredentials({ username: '', password: '' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    setError('');

    try {
      await login({
        username: credentials.username,
        password: credentials.password,
        role: selectedRole
      });

      // Navigate based on role
      const roleRoutes = {
        'super-admin': '/super-admin',
        'university-admin': '/university-admin',
        'faculty': '/faculty',
        'student': '/student'
      };
      
      navigate(roleRoutes[selectedRole]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (selectedRole) {
      case 'super-admin':
        return { username: 'SUPERADMIN', password: 'SUPER9090@@@@' };
      case 'university-admin':
        return { username: 'admin@university.edu', password: 'Password' };
      case 'faculty':
        return { username: 'Faculty ID', password: 'Password' };
      case 'student':
        return { username: 'student@university.edu', password: 'Password' };
      default:
        return { username: 'Username', password: 'Password' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Uni<span className="text-red-600">Mark</span>
          </h1>
          <p className="text-gray-400 text-lg">
            University Attendance Management System
          </p>
        </motion.div>

        {!selectedRole ? (
          /* Role Selection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelect(role.type)}
                className="glass-effect rounded-xl p-6 cursor-pointer hover:border-red-600/50 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 mx-auto`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-400 text-sm text-center">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Login Form */
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-effect rounded-xl p-8">
              <div className="flex items-center justify-center mb-6">
                {(() => {
                  const role = roles.find(r => r.type === selectedRole);
                  if (!role) return null;
                  return (
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                  );
                })()}
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {roles.find(r => r.type === selectedRole)?.title} Login
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4"
                >
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={getPlaceholderText().username}
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    placeholder={getPlaceholderText().password}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </motion.button>
              </form>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Role Selection
              </button>

              {selectedRole === 'super-admin' && (
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <p className="text-blue-400 text-sm text-center font-medium">
                    Demo Credentials Available
                  </p>
                  <p className="text-blue-300/70 text-xs text-center mt-1">
                    Use: SUPERADMIN / SUPER9090@@@@
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
