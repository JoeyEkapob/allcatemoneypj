import { Navigate,Outlet } from "react-router";

const RedirectIfAuth: React.FC = () => {
    
    const token = localStorage.getItem('token')

    if(token){
        return <Navigate to='/home' replace/>
    }
    return <Outlet />
}
export default RedirectIfAuth;