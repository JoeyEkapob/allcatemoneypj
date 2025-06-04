import { Navigate, Outlet ,useLocation} from 'react-router';
import { useAuth } from './AuthContext';

export default function RedirectIfAuthenticated() {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
console.log(from)
  if (authLoading) return null; // หรือ loading spinner

  return user ? <Navigate to={from} replace /> : <Outlet />;
}