/**
 * Location utility functions for GPS validation and distance calculation
 */

export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param loc1 First location
 * @param loc2 Second location
 * @returns Distance in meters
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance to human-readable string
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "50m", "1.2km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get current user location using Geolocation API
 * @returns Promise with location or null if denied/unavailable
 */
export async function getCurrentLocation(): Promise<Location | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting current location:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Validate if user is within allowed distance from tip location
 * @param userLocation User's current location
 * @param tipLocation Tip's location
 * @param maxDistanceMeters Maximum allowed distance in meters (default: 50m)
 * @returns true if within range, false otherwise
 */
export function validateLocationProximity(
  userLocation: Location,
  tipLocation: Location,
  maxDistanceMeters: number = 50
): boolean {
  const distance = calculateDistance(userLocation, tipLocation);
  return distance <= maxDistanceMeters;
}
