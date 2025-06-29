import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, User, Plus, Search, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const navigation = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function DesktopSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r border-border pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-foreground">Nomading Now</h1>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {label}
                  </NavLink>
                );
              })}
            </nav>
            
            <div className="flex-shrink-0 px-2 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tips..."
                  className="pl-10"
                />
              </div>
              
              {user ? (
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Write Tip
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="outline" 
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* User info at bottom */}
              {user && (
                <div className="border-t border-border pt-3">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar_url} alt={user.nickname} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.nickname.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.nickname}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.points} points
                      </p>
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  );
}