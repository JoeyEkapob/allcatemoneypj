import React from "react";
import { Navigate , Outlet } from "react-router";
import { jwtDecode , JwtPayload } from "jwt-decode";


interface MytokenPayload extends JwtPayload {
    exp: number
}

const RequireAuth: React.FC =  () =>{
   const token = localStorage.getItem('token');


  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode<MytokenPayload>(token);
    const now = Date.now() / 1000;


    if (decoded.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('token หมดอายุ');
      return <Navigate to="/" replace />;
    }


    return <Outlet />;
  } catch (err) {
    console.log(err)
    return <Navigate to="/" replace />;
  }
};

export default RequireAuth;