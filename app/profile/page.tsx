'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthModal } from '@/components/auth/AuthModal';

export default function ProfilePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ProtectedRoute
        onAuthRequired={() => setIsAuthModalOpen(true)}
        fallback={
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
              <p className="text-gray-600">Sign in to view and manage your profile</p>
            </div>
          </main>
        }
      >
        <ProfileContent />
      </ProtectedRoute>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signin"
      />
    </div>
  );
}