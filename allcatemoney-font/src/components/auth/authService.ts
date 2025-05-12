interface User {
    id: number;
    name:string;
    email:string;
}

export const loginRequest = async (username:string ,password:string)=>{

    const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
    
      if(!data.success){
        throw {
        field: data.field || 'general',
        message: data.message || 'เกิดข้อผิดพลาด',
      };
    
      }else{

        return {
            user: data.user as User,
            token: data.token as string
          };
      }
      //const data = await response.json();
     
    };

