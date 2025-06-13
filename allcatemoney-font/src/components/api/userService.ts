import { User } from "./authService";

export interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url: string;
  bio: string;
  role_name: string;
  address_line: string;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
  country: string;
  custom_id: string;
  facebook_address: string;
  line_address: string;
  github_address: string;
}

export const getUserProfile = async () => {
  const res = await fetch(`http://localhost:5000/user/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userresult = await res.json();

  /*  console.log(userresult.message)
  return */

  if (!userresult.success) {
    return {
      field: userresult.field || "general",
      message: userresult.message || "เกิดข้อผิดพลาด",
    };
  } else {
    // console.log(data)
    return userresult.data as UserProfile;
  }
};

type ProfileUpdatePayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  bio: string;
  facebook_address: string;
  line_address: string;
  github_address: string;
};

export const updateminddleUserProfile = async (
  profileData: ProfileUpdatePayload,
  id: string,
) => {
  try{
 const res = await fetch(`http://localhost:5000/user/editprofilemiddle/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  const datareturn = await res.json();
  //console.log(datareturn)

  if (!datareturn.success) {
  
    throw new Error(datareturn.message || "Failed to update profile");
  }

  return {
    user: datareturn.user as User,
    profile: datareturn.profile as ProfileUpdatePayload,
  };
  }catch(e){
     throw {
      field: "general",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    };
  }
 
};
