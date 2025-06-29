'use client';

import { useState, useEffect, useRef } from 'react';

interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
}

interface VisitedArea {
  center: { lat: number; lng: number };
  radius: number; // meters
  visitCount: number;
  firstVisit: number;
  lastVisit: number;
  totalDuration: number; // minutes
}

export function useLocationTracking() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
  const [visitedAreas, setVisitedAreas] = useState<VisitedArea[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [locationServiceError, setLocationServiceError] = useState<string | null>(null);
  
  const watchIdRef = useRef<number | null>(null);
  const lastLocationRef = useRef<LocationPoint | null>(null);

  // Calculate distance between two points in meters
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Check if a location is within visited areas
  const isLocationVisited = (lat: number, lng: number): boolean => {
    return visitedAreas.some(area => {
      const distance = calculateDistance(lat, lng, area.center.lat, area.center.lng);
      return distance <= area.radius;
    });
  };

  // Get nearby visited areas for a location
  const getNearbyVisitedAreas = (lat: number, lng: number, maxDistance: number = 500): VisitedArea[] => {
    return visitedAreas.filter(area => {
      const distance = calculateDistance(lat, lng, area.center.lat, area.center.lng);
      return distance <= maxDistance;
    });
  };

  // Process location update
  const processLocationUpdate = (location: LocationPoint) => {
    setCurrentLocation({ lat: location.lat, lng: location.lng });
    
    // Add to history
    setLocationHistory(prev => {
      const newHistory = [...prev, location];
      // Keep only last 1000 points to manage memory
      return newHistory.slice(-1000);
    });

    // Update visited areas
    setVisitedAreas(prev => {
      const existingAreaIndex = prev.findIndex(area => {
        const distance = calculateDistance(location.lat, location.lng, area.center.lat, area.center.lng);
        return distance <= 100; // 100m radius for same area
      });

      if (existingAreaIndex >= 0) {
        // Update existing area
        const updatedAreas = [...prev];
        const area = updatedAreas[existingAreaIndex];
        area.visitCount += 1;
        area.lastVisit = location.timestamp;
        
        // Calculate duration if we have a previous location
        if (lastLocationRef.current) {
          const timeDiff = (location.timestamp - lastLocationRef.current.timestamp) / (1000 * 60); // minutes
          if (timeDiff < 60) { // Only count if less than 1 hour gap
            area.totalDuration += timeDiff;
          }
        }
        
        return updatedAreas;
      } else {
        // Create new area if user stayed for more than 5 minutes
        const recentLocations = [...prev].slice(-5);
        const isStaying = recentLocations.length >= 3 && recentLocations.every(point => {
          const distance = calculateDistance(location.lat, location.lng, point.center.lat, point.center.lng);
          return distance <= 50; // 50m radius
        });

        if (isStaying) {
          return [...prev, {
            center: { lat: location.lat, lng: location.lng },
            radius: 100,
            visitCount: 1,
            firstVisit: location.timestamp,
            lastVisit: location.timestamp,
            totalDuration: 5
          }];
        }
        
        return prev;
      }
    });

    lastLocationRef.current = location;
  };

  // Get user-friendly error message
  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was denied. Please enable location permissions in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please check your device's location settings and try again.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "An unknown error occurred while accessing your location. Please try again.";
    }
  };

  // Start location tracking
  const startTracking = async () => {
    if (!navigator.geolocation) {
      setLocationServiceError('Geolocation is not supported by this browser.');
      return false;
    }

    // Clear any previous errors
    setLocationServiceError(null);

    try {
      // Request permission
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);

      if (permission.state === 'denied') {
        setLocationServiceError('Location access was denied. Please enable location permissions in your browser settings.');
        return false;
      }

      // Get current position first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          };
          processLocationUpdate(location);
          // Clear any previous errors on successful location update
          setLocationServiceError(null);
        },
        (error) => {
          console.error('Error getting current position:', error);
          const errorMessage = getLocationErrorMessage(error);
          setLocationServiceError(errorMessage);
          setIsTracking(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );

      // Start watching position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const location: LocationPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          };
          
          // Only process if accuracy is reasonable (< 100m) and location changed significantly
          if (position.coords.accuracy < 100) {
            if (!lastLocationRef.current || 
                calculateDistance(
                  location.lat, location.lng,
                  lastLocationRef.current.lat, lastLocationRef.current.lng
                ) > 10) { // 10m minimum movement
              processLocationUpdate(location);
              // Clear any previous errors on successful location update
              setLocationServiceError(null);
            }
          }
        },
        (error) => {
          console.error('Error watching position:', error);
          const errorMessage = getLocationErrorMessage(error);
          setLocationServiceError(errorMessage);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 60000
        }
      );

      setIsTracking(true);
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setLocationServiceError('Failed to start location tracking. Please try again.');
      return false;
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLocationServiceError(null);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('nomad-location-history');
    const savedAreas = localStorage.getItem('nomad-visited-areas');
    
    if (savedHistory) {
      try {
        setLocationHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading location history:', error);
      }
    }
    
    if (savedAreas) {
      try {
        setVisitedAreas(JSON.parse(savedAreas));
      } catch (error) {
        console.error('Error loading visited areas:', error);
      }
    }

    // Auto-start tracking if permission was previously granted
    if (localStorage.getItem('nomad-tracking-enabled') === 'true') {
      startTracking();
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (locationHistory.length > 0) {
      localStorage.setItem('nomad-location-history', JSON.stringify(locationHistory));
    }
  }, [locationHistory]);

  useEffect(() => {
    if (visitedAreas.length > 0) {
      localStorage.setItem('nomad-visited-areas', JSON.stringify(visitedAreas));
    }
  }, [visitedAreas]);

  useEffect(() => {
    localStorage.setItem('nomad-tracking-enabled', isTracking.toString());
  }, [isTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    currentLocation,
    locationHistory,
    visitedAreas,
    isTracking,
    permissionStatus,
    locationServiceError,
    startTracking,
    stopTracking,
    isLocationVisited,
    getNearbyVisitedAreas,
    calculateDistance
  };
}