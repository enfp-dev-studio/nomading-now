import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

interface ProtectedDevRouteProps {
  children: React.ReactNode;
}

// List of authorized developer emails
const AUTHORIZED_DEVELOPERS = [
  'enfpdevtest@gmail.com',
  'enfpdevtest2@gmail.com',
  // Add more authorized developer emails here
];

export function ProtectedDevRoute({ children }: ProtectedDevRouteProps) {
  const { user, isLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Allow access even without login for development
        setIsAuthorized(true);
      } else {
        // Check if user email is in the authorized list
        const authorized = AUTHORIZED_DEVELOPERS.includes(user.email);
        setIsAuthorized(authorized);
      }
    }
  }, [user, isLoading]);

  // Show loading state while checking authentication
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // For development, allow access
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  // Show development tools for authorized users
  return <>{children}</>;
}

// Alternative component for showing access denied message instead of redirect
export function ProtectedDevRouteWithMessage({ children }: ProtectedDevRouteProps) {
  const { user, isLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setIsAuthorized(false);
      } else {
        const authorized = AUTHORIZED_DEVELOPERS.includes(user.email);
        setIsAuthorized(authorized);
      }
    }
  }, [user, isLoading]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Development Tools
            </h2>
            <p className="text-muted-foreground mb-4">
              Internal development and debugging tools for the Nomading Now platform.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
              <AlertTriangle className="w-4 h-4" />
              <span>Access available during development</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}