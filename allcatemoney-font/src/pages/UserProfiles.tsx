import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getUserProfile ,UserProfile  } from "../components/api/userService";
import { useLoading } from '../context/LoadingContext';
import { useAuth } from "../components/auth/AuthContext";


export default function UserProfiles() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const {showLoading, hideLoading } = useLoading();
  
  useEffect(()=>{
   
 const fetchProfile = async () => {
      if (!token) return;
      showLoading();
      try{
        const data = await getUserProfile(token);
        setProfile(data)
      }catch(err){
        console.error('โหลด profile ไม่สำเร็จ',err)
      }finally{
        hideLoading();
      }
    }
    fetchProfile()
  },[token])

  return (
    <>
        
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="โปรไฟล์" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          โปรไฟล์
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profile} />
          <UserInfoCard profile={profile}/>
          <UserAddressCard profile={profile} />
        </div>
      </div>
    </>
  );
}
