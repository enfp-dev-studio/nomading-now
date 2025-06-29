'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { LocationBasedTipForm } from '@/components/create-tip/LocationBasedTipForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthModal } from '@/components/auth/AuthModal';

export default function CreateTipPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ProtectedRoute
        onAuthRequired={() => setIsAuthModalOpen(true)}
        fallback={
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
                <p className="text-gray-600">Sign in to share quick tips about places you've actually visited</p>
              </div>
            </div>
          </main>
        }
      >
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
              <p className="text-gray-600">Share quick tips about places you've actually visited</p>
            </div>
            <LocationBasedTipForm />
          </div>
        </main>
      </ProtectedRoute>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signin"
      />
    </div>
  );
}