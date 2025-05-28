import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginRequest, User } from '../api/authService';
import { getUserProfile } from '../api/userService';


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null)

  useEffect(()=>{
    const loaduser = async () => {
      try{
        const res = await getUserProfile();
        setUser(res)
      }catch{
        setUser(null)
      }
    }
    loaduser();
  },[])

  const login = async (username: string, password: string) => {
    try{
      await loginRequest(username, password);
      const res = await getUserProfile();
       console.log(res)
        return
      setUser(res)
      

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
  const setUserAndSync = (updatedUser:User) => {
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser)); // ✅ sync localStorage
};

  return (
    <AuthContext.Provider value={{ user, login, logout ,  setUser:setUserAndSync }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
