import React from "react";
import ProfileCard from "@/components/profile/ProfileCard";;

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div> 
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information Card */}
      <ProfileCard />
    </div>
  );
};

export default Profile;
