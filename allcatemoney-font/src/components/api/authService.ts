export interface User {
    id: string;
    username:string;
    email:string;
    fullname:string;
}

export interface Erruserdata {
 field : string;
 message : string ;
}

type AuthErrorThrown = {
  status: number;
  data: Partial<Erruserdata>; 
};

export const loginRequest = async (username:string ,password:string)=>{
   
  try{

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
      
        throw {
        status: response.status,
        data: data
      };

    }

      return { user : data.user as User}
     
   } catch (err : unknown) {
      const error = err as AuthErrorThrown;
 
     if(error?.status === 401){
          const data = error.data;
        
        throw {
            field: data.field || 'general',
            message: data.message || 'เกิดข้อผิดพลาด'
        }
    
      }
       throw {
      field: 'general',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    };

  }
    
     
};

