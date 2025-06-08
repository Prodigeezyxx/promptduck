
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex w-full">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
