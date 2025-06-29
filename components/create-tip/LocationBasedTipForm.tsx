'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertCircle, CheckCircle2, Map, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TIP_CATEGORIES } from '@/lib/constants';
import { TipCategory } from '@/lib/types';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { LocationPickerMap } from './LocationPickerMap';
import { TipsService } from '@/lib/services/tips';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function LocationBasedTipForm() {
  const { user } = useAuth();
  const {
    currentLocation,
    visitedAreas,
    isTracking,
    permissionStatus,
    locationServiceError,
    startTracking,
    calculateDistance
  } = useLocationTracking();

  const [formData, setFormData] = useState({
    locationName: '',
    category: '' as TipCategory | '',
    content: '',
    selectedLocation: null as { lat: number; lng: number } | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationDetails, setLocationDetails] = useState<{
    address: string;
    coordinates: string;
  } | null>(null);

  // Reverse geocoding function (mock implementation)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // In a real app, you would use a geocoding service like Google Maps API
    // For now, we'll create a mock address based on coordinates
    const areas = [
      { name: 'Sukhumvit Road', lat: 13.7563, lng: 100.5018 },
      { name: 'Silom Road', lat: 13.7307, lng: 100.5418 },
      { name: 'Khao San Road', lat: 13.7590, lng: 100.4977 },
      { name: 'Chatuchak Market', lat: 13.7998, lng: 100.5501 },
      { name: 'Siam Square', lat: 13.7460, lng: 100.5340 }
    ];

    // Find closest known area
    let closestArea = areas[0];
    let minDistance = calculateDistance(lat, lng, areas[0].lat, areas[0].lng);

    areas.forEach(area => {
      const distance = calculateDistance(lat, lng, area.lat, area.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestArea = area;
      }
    });

    if (minDistance < 2000) { // Within 2km
      return `Near ${closestArea.name}, Bangkok`;
    }

    return `Bangkok, Thailand (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  // Auto-fill location name based on current location
  useEffect(() => {
    if (currentLocation && !formData.selectedLocation) {
      reverseGeocode(currentLocation.lat, currentLocation.lng).then(address => {
        setFormData(prev => ({
          ...prev,
          locationName: address,
          selectedLocation: currentLocation
        }));
        setLocationDetails({
          address,
          coordinates: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
        });
      });
    }
  }, [currentLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to share tips');
      return;
    }
    
    if (!formData.locationName || !formData.category || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    if (!currentLocation) {
      toast.error('Current location not available');
      return;
    }

    // Check if selected location is within allowed radius (2km)
    const distance = calculateDistance(
      formData.selectedLocation.lat, 
      formData.selectedLocation.lng,
      currentLocation.lat, 
      currentLocation.lng
    );

    if (distance > 2000) { // 2km radius
      toast.error('You can only add tips within 2km of your current location');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await TipsService.createTip({
        userId: user.id,
        content: formData.content,
        locationName: formData.locationName,
        latitude: formData.selectedLocation.lat.toString(),
        longitude: formData.selectedLocation.lng.toString(),
        city: 'Bangkok', // In a real app, this would be extracted from geocoding
        country: 'Thailand', // In a real app, this would be extracted from geocoding
        category: formData.category,
        photos: null, // For now, no photo upload
      });
      
      toast.success('Tip shared successfully!');
      
      // Reset form but keep current location
      setFormData({
        locationName: '',
        category: '',
        content: '',
        selectedLocation: null
      });
      setLocationDetails(null);
    } catch (error) {
      console.error('Error creating tip:', error);
      toast.error('Failed to share tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    const address = await reverseGeocode(location.lat, location.lng);
    setFormData(prev => ({
      ...prev,
      selectedLocation: location,
      locationName: address
    }));
    setLocationDetails({
      address,
      coordinates: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
    });
    setShowLocationPicker(false);
    toast.success('Location selected!');
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Show location service error if there's a specific error
  if (locationServiceError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Service Issue</h3>
          <p className="text-gray-600 mb-4">
            {locationServiceError}
          </p>
          <div className="space-y-2">
            <Button onClick={startTracking} className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <p className="text-xs text-gray-500">
              Make sure location services are enabled on your device and browser.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Access Required</h3>
          <p className="text-gray-600 mb-4">
            To ensure authentic tips, we need access to your location to verify you're sharing about nearby places.
          </p>
          <p className="text-sm text-gray-500">
            Please enable location access in your browser settings and refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isTracking) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Navigation className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Location Access</h3>
          <p className="text-gray-600 mb-4">
            We need your location to automatically fill in where you are and ensure you're sharing about nearby places.
          </p>
          <Button onClick={startTracking} className="bg-blue-600 hover:bg-blue-700">
            <Navigation className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Location</h3>
          <p className="text-gray-600">Please wait while we determine your current location...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Location Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <div className="font-medium text-sm">Location Active</div>
                <div className="text-xs text-gray-500">
                  {locationDetails?.address || 'Getting location name...'}
                </div>
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          </div>
          {locationDetails && (
            <div className="mt-2 text-xs text-gray-500 font-mono">
              📍 {locationDetails.coordinates}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection */}
            <div>
              <Label htmlFor="locationName">Location *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="locationName"
                  placeholder="Location will be auto-filled based on your current position"
                  value={formData.locationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  required
                  className="border-green-300 bg-green-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLocationPicker(true)}
                  className="flex-shrink-0"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-green-600 mt-1">
                ✓ Auto-filled with your current location. Click map icon to adjust within 2km radius.
              </p>
            </div>

            {/* Category */}
            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(value: TipCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="What type of place is this?" />
                </SelectTrigger>
                <SelectContent>
                  {TIP_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{category.emoji}</span>
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Tip */}
            <div>
              <Label htmlFor="content">Your Quick Tip *</Label>
              <Textarea
                id="content"
                placeholder="Share a quick tip... (e.g., 'Fast WiFi, quiet, great coffee ☕')"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                maxLength={140}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.content.length}/140 characters
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Ready to share</span>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {isSubmitting ? 'Sharing...' : 'Share Tip'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowLocationPicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 p-4">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    You can select any location within 2km of your current position
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Current location: {locationDetails?.coordinates}
                </div>
              </div>
              <div className="h-[calc(100%-80px)] rounded-lg overflow-hidden">
                <LocationPickerMap
                  currentLocation={currentLocation}
                  onLocationSelect={handleLocationSelect}
                  maxRadius={2000} // 2km
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visit History Summary */}
      {visitedAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Your Travel Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{visitedAreas.length}</div>
                <div className="text-sm text-gray-600">Places Visited</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {visitedAreas.reduce((sum, area) => sum + area.visitCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Visits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatDuration(visitedAreas.reduce((sum, area) => sum + area.totalDuration, 0))}
                </div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(visitedAreas.reduce((sum, area) => sum + area.totalDuration, 0) / visitedAreas.length)}m
                </div>
                <div className="text-sm text-gray-600">Avg. Stay</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}