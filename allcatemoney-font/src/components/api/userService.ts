export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role_name: string;
  avatar_url?: string;
  bio?: string;
  address_line?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postal_code?: string;
  country?: string;

}

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('token');


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

export const updateUserProfile = async (profileData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing token');

  const res = await fetch(`${API_BASE}/user-profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return await res.json();
};
