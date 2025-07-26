import ProfileInformation from "@/components/pages/dashboard/user/profile/profile-information";
import ProfileNavigation from "@/components/pages/dashboard/user/profile/profile-navigation";
import ProfilePassword from "@/components/pages/dashboard/user/profile/profile-password";
import { getCurrentUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile settings",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const user = await getCurrentUser();
  const activeTab = tab ? tab : "information";

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className=" mb-8 mt-3  text-sm text-gray-500">
        Manage your profile settings
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProfileNavigation activeTab={activeTab} />
        </div>

        <div className="md:col-span-3">
          {activeTab === "information" && <ProfileInformation user={user} />}
          {activeTab === "password" && <ProfilePassword user={user} />}
        </div>
      </div>
    </div>
  );
}
