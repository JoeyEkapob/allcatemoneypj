export interface User {
    id: string;
    username:string;
    email:string;
    full_name:string;
}

export const loginRequest = async (username:string ,password:string)=>{

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
    
      if(!data.success){
        throw {
        field: data.field || 'general',
        message: data.message || 'เกิดข้อผิดพลาด'
      };
    
      }else{

        return {
            user: data.user as User,
            token: data.token as string
          };
      }
      //const data = await response.json();
     
    };

