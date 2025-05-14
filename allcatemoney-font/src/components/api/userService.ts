// 📄 src/api/userService.ts



export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing token');

  const res = await fetch(`http://localhost:5000/userprofile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  return await res.json();
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
