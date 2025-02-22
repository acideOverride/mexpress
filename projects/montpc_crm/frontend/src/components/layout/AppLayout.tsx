import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ErrorBoundary } from '../shared/ErrorBoundary';

export const AppLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};