import { User } from "./authService";

export interface UserProfile {
  id: string,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  avatar_url: string,
  bio: string,
  role_name: string,
  address_line: string,
  subdistrict: string,
  district: string,
  province: string,
  postal_code: string,
  country: string,
  custom_id:string,
  facebook_address:string,
  line_address:string,
  github_address:string
}


export const getUserProfile = async (token:string): Promise<UserProfile> => {


  if (!token) throw new Error('Missing token');

  const res = await fetch(`http://localhost:5000/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
    const userresult = await res.json();
      if(!userresult.success){
        throw {
        field: userresult.field || 'general',
        message: userresult.message || 'เกิดข้อผิดพลาด',
      };
    
      }else{
        //console.log(data)
      return  userresult.data as UserProfile
            
      }


 
};

type ProfileUpdatePayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number : string,
  bio : string,
  facebook_address: string,
  line_address : string,
  github_address : string,
  
};


export const updateUserProfile = async (profileData:ProfileUpdatePayload,id:string,token:string) => {
  //const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing token');

  const res = await fetch(`http://localhost:5000/user/editprofile/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  const datareturn = await res.json();

  if (!datareturn.success) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return {
              user: datareturn.user as User,
              profile: datareturn.profile as ProfileUpdatePayload
            };
    
};
