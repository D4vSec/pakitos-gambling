import React from "react";
import Card from "../landingPage/Card";
import Button from "../buttons/Button";
import UserSVG from "../svg/UserSVG";
import EmailSVG from "../svg/EmailSVG";
import LockSVG from "../svg/LockSVG";

const ProfileCard = () => {
  return (
    <Card className="py-6 px-6 border-0">
      <h2 className="flex items-center gap-2 text-3xl">
        <UserSVG />Profile Information
      </h2>
      <p className="text-1">Update your profile.</p>
      <div className="py-3">
        <div className="space-y-2">
          <label htmlFor="username" className="flex items-center gap-2">
            Username
          </label>
          <input type="text" id="username" className="border rounded" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2">
            <EmailSVG/>
            Email
          </label>
          <input type="email" id="email" className="border rounded-2 " />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="flex items-center gap-2">
            <LockSVG/>
            Password
          </label>
          <input type="password" id="password" className="border rounded" />
        </div>
      </div>
      <Button className="mt-4">Update Profile</Button>
    </Card>
  );
};

export default ProfileCard;
