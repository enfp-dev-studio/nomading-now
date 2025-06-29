import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { HomePage } from '@/pages/HomePage';
import { MapPage } from '@/pages/MapPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DevPage } from '@/pages/DevPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="nomad-tips-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <DesktopSidebar />
            <div className="lg:pl-64">
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="map" element={<MapPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Routes>
            </div>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;