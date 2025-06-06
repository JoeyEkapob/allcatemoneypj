import { Navigate, Outlet,useLocation } from 'react-router';
import { useAuth } from './AuthContext';


export default function RequireAuth() {

 
  const { user , authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <div></div>;

  return user ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
}
