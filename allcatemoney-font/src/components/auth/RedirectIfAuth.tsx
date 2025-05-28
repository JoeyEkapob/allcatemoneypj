import { jwtDecode } from "jwt-decode";
import { Navigate,Outlet, replace } from "react-router";
import Cookies from 'js-cookie';

interface MytokenPayload{
    exp:number
}

const RedirectIfAuth: React.FC = () => {
    
   console.log('token from cookie:', Cookies.get('token'));
   const token = Cookies.get('token')

    if(token){
        try{
        const decode = jwtDecode<MytokenPayload>(token)
        const now = Date.now() / 1000

        if( decode.exp > now){
            return <Navigate to='/home' replace />
        }else{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        }catch{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
       
    }
    
    return <Outlet />
}
export default RedirectIfAuth;