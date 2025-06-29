import { Outlet } from 'react-router-dom';
import { TabNavigation } from './TabNavigation';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="max-w-md mx-auto lg:max-w-4xl">
          <Outlet />
        </div>
      </main>
      {/* Show tab navigation only on mobile/tablet - sticky at bottom */}
      <div className="lg:hidden">
        <TabNavigation />
      </div>
    </div>
  );
}