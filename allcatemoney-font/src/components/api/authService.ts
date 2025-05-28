export interface User {
    id: string;
    username:string;
    email:string;
    full_name:string;
}

export const loginRequest = async (username:string ,password:string)=>{
   try{
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include', // ✅ สำคัญ
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

   

      const data = await response.json();
   
      if(!data.success){

        return {
        field: data.field || 'general',
        message: data.message || 'เกิดข้อผิดพลาด'
      };
    
      }else{

        return {
            user: data.user as User,
          };
      }
      //const data = await response.json();
   } catch (err) {
  console.error('Login error:', err); // ดู error message ตรงนี้
}
    
     
    };

