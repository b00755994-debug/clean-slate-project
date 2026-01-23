import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  skipOnboardingCheck?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, skipOnboardingCheck = false }: ProtectedRouteProps) {
  const { user, profile, isAdmin, isLoading, isProfileLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to onboarding if not completed (except for onboarding page itself)
  if (!skipOnboardingCheck && profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
