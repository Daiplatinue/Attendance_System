import React from 'react';

interface UserData {
  u_fullname: string;
  u_role: string;
  u_department: string;
  u_year: string;
  u_email: string;
  u_contact: string;
  u_address: string;
  u_section: string;
}

interface UserInfoProps {
  userData: UserData;
  parentData?: UserData | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({ userData, parentData }) => {
  return (
    <div className="flex-grow text-center md:text-left">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1">{userData.u_fullname}</h2>
      {parentData && (
        <p className="text-zinc-400 mb-4">Parent: {parentData.u_fullname}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Section</p>
          <p>{userData.u_section}</p>
        </div>
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Department</p>
          <p>{userData.u_department}</p>
        </div>
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Year Level</p>
          <p className="break-all">{userData.u_year}</p>
        </div>
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Email</p>
          <p className="break-all">{userData.u_email}</p>
        </div>
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Contact Number</p>
          <p className="break-all">{userData.u_contact}</p>
        </div>
        <div className="mt-3 sm:mt-5">
          <p className="text-zinc-400 text-sm mb-1">Address</p>
          <p className="break-all">{userData.u_address}</p>
        </div>
      </div>
    </div>
  );
};