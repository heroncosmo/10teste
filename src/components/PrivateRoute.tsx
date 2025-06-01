import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

const PrivateRoute = ({ children, requireSuperAdmin = false }: PrivateRouteProps) => {
  const { user, isLoading, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireSuperAdmin && !profile?.is_superadmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
