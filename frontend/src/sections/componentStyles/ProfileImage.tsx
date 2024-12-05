import React from 'react';

interface ProfileImageProps {
  imageName: string;
  altText: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ imageName, altText }) => {
    const profileImageUrl = `http://localhost:3000/profiles/${imageName}`;
    console.log(profileImageUrl);
    
    return (
        <img 
            src={profileImageUrl}
            alt={altText}
            className="w-[15rem] h-[14rem] rounded-3xl object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `http://localhost:3000/profiles/default.jpg`;
            }}
        />
    );
};
