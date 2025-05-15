// 📄 src/api/userService.ts



export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing token');

  const res = await fetch(`http://localhost:5000/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
    const data = await res.json();

      if(!data.success){
        throw {
        field: data.field || 'general',
        message: data.message || 'เกิดข้อผิดพลาด',
      };
    
      }else{

        return{ username :data.username as string}
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
