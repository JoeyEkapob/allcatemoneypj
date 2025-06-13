import { createContext, useContext, useState, ReactNode, useEffect  } from 'react';
import { loginRequest, User ,Erruserdata } from '../api/authService';
import { getUserProfile } from '../api/userService';
import { useLoading } from '../../context/LoadingContext';
import { useLocation } from 'react-router';
import { withMinimumLoading } from '../utils/loadingHelper';
import Swal from 'sweetalert2';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isChecked:boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  authLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<User | null>(null)
  const { showLoading , hideLoading } = useLoading();
  const [ authLoading, setAuthLoading ] = useState(false)
  const location = useLocation();
/* 
  console.log(authLoading,'Auth')
  console.log(user,'Auth') */

useEffect(() => {
  const checkAuth = async () => {
    if(authLoading) return //console.log('err')
    setAuthLoading(true);
    await withMinimumLoading(
      async () => {
        try {
          const res = await fetch('http://localhost:5000/me', {
            credentials: 'include',
          });
          console.log()
          
          const data = await res.json();
          //console.log(data)
       
          if (res.status === 401) {
            setUser(null);
            if(data.type === 'expired'){
               Swal.fire({
                  icon: 'warning',
                  title: data.message ||'Session หมดอายุ',
                  text: 'กรุณาเข้าสู่ระบบใหม่',
                  confirmButtonText: 'ตกลง',
                });
            }
          }
         // console.log(data.user)
          setUser(data.user);
        } catch  {
            setUser(null);
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
            });
        } finally {
          setAuthLoading(false);
        }
      },
      showLoading,
      hideLoading,
      500 // โหลดอย่างน้อย 1 วินาที
    );
  };
    checkAuth();
}, [location.pathname]);


  const login = async (username: string, password: string , isChecked:boolean) => {
    try{  
      const res = await loginRequest(username, password, isChecked);
      
      setUser(res.user)


    }catch(err:unknown){
    const error = err as Erruserdata;
      
      if (process.env.NODE_ENV === 'development') {
      console.error('Login error context:', error);
    }
     throw {
        field: error.field || 'general',
        message: error.message || 'เข้าสู่ระบบไม่สำเร็จ',
      }; 
    }
  };

  const logout = async () => {
  try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
   

  };


  return (
    <AuthContext.Provider value={{ user, login, logout , authLoading,setUser  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
