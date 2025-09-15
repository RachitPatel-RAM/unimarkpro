import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

const LocationStatus: React.FC = () => {
  const { permissionGranted, error, requestPermission } = useLocation();

  if (permissionGranted && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-green-400"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Location Active</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3 bg-red-900/20 border border-red-600/30 rounded-lg p-3"
    >
      <AlertTriangle className="w-5 h-5 text-red-400" />
      <div className="flex-1">
        <p className="text-red-400 text-sm font-medium">Location Required</p>
        <p className="text-red-300/70 text-xs">Enable location to mark attendance</p>
      </div>
      <button
        onClick={requestPermission}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
      >
        Enable
      </button>
    </motion.div>
  );
};

export default LocationStatus;
