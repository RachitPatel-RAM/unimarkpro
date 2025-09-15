import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  location: GeolocationPosition | null;
  permissionGranted: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  isWithinRadius: (targetLat: number, targetLon: number, radiusMeters: number) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const isWithinRadius = (targetLat: number, targetLon: number, radiusMeters: number): boolean => {
    if (!location) return false;
    
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLat,
      targetLon
    );
    
    return distance <= radiusMeters;
  };

  const requestPermission = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setLocation(position);
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      setPermissionGranted(false);
    }
  };

  useEffect(() => {
    // Auto-request permission on mount
    requestPermission();

    // Watch position if permission is granted
    let watchId: number;
    if (permissionGranted) {
      watchId = navigator.geolocation.watchPosition(
        (position) => setLocation(position),
        (err) => setError(err.message),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [permissionGranted]);

  const value = {
    location,
    permissionGranted,
    error,
    requestPermission,
    isWithinRadius
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
