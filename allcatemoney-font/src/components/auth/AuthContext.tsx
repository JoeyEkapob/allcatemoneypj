import { createContext, useContext, useState, ReactNode, useEffect  } from 'react';
import { loginRequest, User } from '../api/authService';
import { getUserProfile } from '../api/userService';
import { useLoading } from '../../context/LoadingContext';
import { useLocation } from 'react-router';


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  authLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<User | null>(null)
  const { showLoading , hideLoading } = useLoading();
  const [ authLoading, setAuthLoading ] = useState(true)
  const location = useLocation();


    useEffect(() => {


    const checkAuth = async () => {
  /*     console.log(location.pathname)
      console.log(authLoading) */
     setAuthLoading(true); // เริ่มโหลดใหม่
        showLoading();

      try {
        const res = await fetch('http://localhost:5000/me', {
          credentials: 'include', // สำคัญ! เพื่อส่ง cookie ไป
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null); // ไม่มี token หรือหมดอายุ
      } finally {

        setAuthLoading(false)
        hideLoading(); // ใช้กับ loading UI
      }
    };

    checkAuth();
  }, [location.pathname]);

  const login = async (username: string, password: string) => {
    try{  
      const res = await loginRequest(username, password);
      setUser(res.user)
    }catch(err:any){
     throw {
        field: err.field || 'general',
        message: err.message || 'เข้าสู่ระบบไม่สำเร็จ',
      }; 
    }
  };

  const logout = async () => {
  try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    /* setUser(null);
    navigate('/login'); */
    } catch (err) {
      console.error('Logout failed', err);
    }
   

  };


  return (
    <AuthContext.Provider value={{ user, login, logout , authLoading  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
