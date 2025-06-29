import { Search, Plus, LogIn } from 'lucide-react';
import { useState } from 'react';
import { TipFeed } from '@/components/tips/TipFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';

export function HomePage() {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header - not sticky, scrolls with content */}
        <header className="bg-card border-b border-border">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Nomading Now</h1>
                <p className="text-sm text-muted-foreground mt-1">Discover real-time nomad tips</p>
              </div>
              
              {/* Desktop search and button */}
              <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by location or keyword..."
                    className="pl-10"
                  />
                </div>
                {user ? (
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Write tip
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign In
                  </Button>
                )}
              </div>
              
              {/* Mobile button */}
              <div className="lg:hidden">
                {user ? (
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Write tip
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
            
            {/* Mobile search */}
            <div className="mt-4 lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by location or keyword..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Feed */}
        <TipFeed />
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  );
}