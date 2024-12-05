import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProfileImage() {
    const [profileImage, setProfileImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/auth/home', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 201) {
                    const imagePath = response.data.user.u_profile;
                    setProfileImage(`http://localhost:3000/profiles/${imagePath}`);
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
                setProfileImage('');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileImage();
    }, []);

    return { profileImage, isLoading };
}