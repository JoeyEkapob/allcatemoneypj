import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getUserProfile } from "../components/api/userService";
import { useLoading } from '../context/LoadingContext';


export default function UserProfiles() {
  const [profile, setProfile] = useState<any>(null);
  const {showLoading, hideLoading } = useLoading();
  

  useEffect(() => {
    showLoading()
    getUserProfile()
      .then(setProfile)
      .catch(err => console.error('เกิดข้อผิดพลาด:', err.message));
    hideLoading()
  }, []);

console.log(profile.username)
 //if (!profile) ? showLoading() : hideLoading();  

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
