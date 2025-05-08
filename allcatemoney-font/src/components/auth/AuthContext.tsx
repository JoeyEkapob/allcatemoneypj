import React , { createContext , useContext ,useState ,ReactNode } from "react";

interface User {
    id: number;
    name:string;
    email:string;
}

interface AuthContextType {
    user:User | null;
    token:string | null;
    login : (user:User,token:string) => void
    logout:() => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const loginRequest = async (email:string ,password:string)=>{
    const res = await fetch('/api/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
    })
    if(!res){
        return new Error('Login Failed')

    }

    const data = await res.json();
    return {
        user:data.user as User,
        token:data.token as string
    }
}

