import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Camera, X, Loader2, Plus, Navigation, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TIP_CATEGORIES, TipCategory } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { tipsApi } from '@/lib/database';
import { toast } from 'sonner';
import {
  getCurrentLocation,
  calculateDistance,
  formatDistance,
  validateLocationProximity,
  type Location
} from '@/lib/location-utils';

const createTipSchema = z.object({
  content: z.string()
    .min(10, 'Tip content must be at least 10 characters')
    .max(280, 'Tip content must not exceed 280 characters'),
  category: z.string().min(1, 'Please select a category'),
  images: z.array(z.string()).max(3, 'Maximum 3 images allowed').optional(),
});

type CreateTipForm = z.infer<typeof createTipSchema>;

interface CreateTipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    address?: string;
  } | null;
  onTipCreated?: () => void;
}

export function CreateTipModal({ open, onOpenChange, location, onTipCreated }: CreateTipModalProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    city: string;
    country: string;
    address?: string;
    shortAddress?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<CreateTipForm>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: '',
      category: '',
      images: [],
    },
  });

  // Get current user location when modal opens
  useEffect(() => {
    if (open) {
      getUserLocation();
    }
  }, [open]);

  // Reverse geocoding to get location info
  useEffect(() => {
    if (location && open) {
      fetchLocationInfo(location.latitude, location.longitude);
    }
  }, [location, open]);

  const getUserLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    const userLoc = await getCurrentLocation();

    if (userLoc) {
      setCurrentLocation(userLoc);
      console.log('✅ Current location obtained:', userLoc);
    } else {
      setLocationError('Unable to get your location. Please enable location services.');
      console.error('❌ Failed to get current location');
    }

    setIsGettingLocation(false);
  };

  const fetchLocationInfo = async (lat: number, lng: number) => {
    setIsLoadingLocation(true);
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        const fullAddress = data.display_name || '';
        
        // Create a shorter, more readable address
        const shortAddressParts = [];
        if (address.road) shortAddressParts.push(address.road);
        if (address.suburb) shortAddressParts.push(address.suburb);
        if (address.city || address.town || address.village) {
          shortAddressParts.push(address.city || address.town || address.village);
        }
        
        setLocationInfo({
          city: address.city || address.town || address.village || address.suburb || 'Unknown City',
          country: address.country || 'Unknown Country',
          address: fullAddress,
          shortAddress: shortAddressParts.join(', ') || fullAddress,
        });
      } else {
        // Fallback location info
        setLocationInfo({
          city: location?.city || 'Unknown City',
          country: location?.country || 'Unknown Country',
          address: location?.address,
          shortAddress: location?.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      }
    } catch (error) {
      console.error('Error fetching location info:', error);
      // Use provided location or fallback
      setLocationInfo({
        city: location?.city || 'Unknown City',
        country: location?.country || 'Unknown Country',
        address: location?.address,
        shortAddress: location?.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL (from Pexels or other source):');
    if (url && url.trim()) {
      const newUrls = [...imageUrls, url.trim()];
      setImageUrls(newUrls);
      form.setValue('images', newUrls);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue('images', newUrls);
  };

  const handleSubmit = async (data: CreateTipForm) => {
    if (!user) {
      toast.error('Please sign in to create tips');
      return;
    }

    if (!location || !locationInfo) {
      toast.error('Location information is required');
      return;
    }

    // GPS validation: Check if user is within 50m of tip location
    if (currentLocation) {
      const tipLocation: Location = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const isValid = validateLocationProximity(currentLocation, tipLocation, 50);

      if (!isValid) {
        const distance = calculateDistance(currentLocation, tipLocation);
        toast.error(
          `You must be within 50m of the location to create a tip. You are ${formatDistance(distance)} away.`,
          { duration: 5000 }
        );
        return;
      }

      console.log('✅ Location validation passed');
    } else {
      // If we couldn't get user's location, show warning but allow creation
      toast.warning('Could not verify your location. Please ensure you are at the location.', {
        duration: 5000,
      });
    }

    setIsSubmitting(true);

    try {
      await tipsApi.createTip({
        user_id: user.id,
        content: data.content,
        category: data.category as TipCategory,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          city: locationInfo.city,
          country: locationInfo.country,
          address: locationInfo.address,
        },
      });

      toast.success('🎉 Tip created successfully!');
      onOpenChange(false);
      form.reset();
      setImageUrls([]);
      setLocationInfo(null);
      setCurrentLocation(null);
      setLocationError(null);
      onTipCreated?.();
    } catch (error) {
      console.error('Error creating tip:', error);
      toast.error('Failed to create tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setImageUrls([]);
    setLocationInfo(null);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Share a Tip
          </DialogTitle>
          <DialogDescription>
            Share your experience at this location with fellow nomads
          </DialogDescription>
        </DialogHeader>

        {/* Location Info */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {isLoadingLocation ? (
                <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MapPin className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isLoadingLocation ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4 animate-pulse"></div>
                </div>
              ) : locationInfo ? (
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {locationInfo.city}, {locationInfo.country}
                  </div>
                  {locationInfo.shortAddress && (
                    <div className="text-muted-foreground text-xs leading-relaxed break-words">
                      {locationInfo.shortAddress}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Navigation className="w-3 h-3" />
                    <span>
                      {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
                    </span>
                  </div>

                  {/* Distance from current location */}
                  {currentLocation && location && (
                    <div className="mt-2">
                      {(() => {
                        const distance = calculateDistance(currentLocation, {
                          latitude: location.latitude,
                          longitude: location.longitude,
                        });
                        const isValid = distance <= 50;
                        return (
                          <Badge
                            variant={isValid ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {isValid ? '✓' : '✗'} {formatDistance(distance)} away
                          </Badge>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Loading location information...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location validation alerts */}
        {isGettingLocation && (
          <Alert>
            <Navigation className="h-4 w-4 animate-pulse" />
            <AlertDescription>
              Getting your current location...
            </AlertDescription>
          </Alert>
        )}

        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locationError}
            </AlertDescription>
          </Alert>
        )}

        {currentLocation && location && (
          (() => {
            const distance = calculateDistance(currentLocation, {
              latitude: location.latitude,
              longitude: location.longitude,
            });
            if (distance > 50) {
              return (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You are {formatDistance(distance)} away from this location. You must be within 50m to create a tip.
                  </AlertDescription>
                </Alert>
              );
            }
            return null;
          })()
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => form.setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TIP_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Your Tip</Label>
              <span className={`text-xs ${
                form.watch('content')?.length > 280
                  ? 'text-destructive'
                  : form.watch('content')?.length > 250
                  ? 'text-orange-500'
                  : 'text-muted-foreground'
              }`}>
                {form.watch('content')?.length || 0} / 280
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="Share your experience... What makes this place special? Any tips for fellow nomads?"
              className="min-h-[100px] resize-none"
              maxLength={280}
              {...form.register('content')}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Images (optional)
                <span className="text-xs text-muted-foreground ml-2">
                  {imageUrls.length} / 3
                </span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
                disabled={imageUrls.length >= 3}
                className="text-xs h-8"
              >
                <Camera className="w-3 h-3 mr-1" />
                Add Image
              </Button>
            </div>
            {imageUrls.length >= 3 && (
              <p className="text-xs text-muted-foreground">
                Maximum 3 images reached
              </p>
            )}
            {form.formState.errors.images && (
              <p className="text-sm text-destructive">
                {form.formState.errors.images.message}
              </p>
            )}
            
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={url}
                        alt={`Tip image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6bTAtNmMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingLocation}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Share Tip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}