interface User {
    id: number;
    name:string;
    email:string;
}

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

