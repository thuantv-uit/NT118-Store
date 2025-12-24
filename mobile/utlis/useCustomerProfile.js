import { useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../constants/api';

const buildDisplayName = (profile, clerkUser) => {
  if (profile?.last_name || profile?.first_name) {
    return `${profile?.last_name || ''} ${profile?.first_name || ''}`.trim();
  }
  if (clerkUser?.fullName) return clerkUser.fullName;
  if (clerkUser?.username) return clerkUser.username;
  return '';
};

export const useCustomerProfile = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncedEmail, setSyncedEmail] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/customers/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        setProfile(null);
      } else {
        throw new Error(`Failed to fetch profile ${response.status}`);
      }
    } catch (err) {
      setError(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Nếu profile thiếu email nhưng Clerk có email → tự động đẩy lên Neon
  useEffect(() => {
    const syncEmailIfMissing = async () => {
      if (
        !profile ||
        syncedEmail ||
        !userId ||
        profile?.email ||
        profile?.emaiil // đã có email
      ) {
        return;
      }

      const clerkEmail =
        user?.primaryEmailAddress?.emailAddress ||
        user?.emailAddresses?.[0]?.emailAddress;

      if (!clerkEmail) return;

      try {
        const formPayload = new FormData();
        formPayload.append('first_name', profile.first_name || '');
        formPayload.append('last_name', profile.last_name || '');
        formPayload.append('phone_number', profile.phone_number || '');
        formPayload.append('role', profile.role || 'buyer');
        formPayload.append('email', clerkEmail);
        formPayload.append('emaiil', clerkEmail); // backend column typo safeguard
        formPayload.append(
          'avatar',
          profile.avatar || user?.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png'
        );

        const response = await fetch(`${API_URL}/customers/${userId}`, {
          method: 'PUT',
          body: formPayload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.ok) {
          const updated = await response.json();
          setProfile(updated);
          setSyncedEmail(true);
        }
      } catch (syncErr) {
        console.warn('Auto-sync email to Neon failed:', syncErr);
      }
    };

    syncEmailIfMissing();
  }, [profile, user, userId, syncedEmail]);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded, fetchProfile]);

  const displayName = useMemo(() => buildDisplayName(profile, user), [profile, user]);

  const isProfileComplete = useMemo(() => {
    if (!profile) return false;
    return Boolean(profile.first_name && profile.last_name && profile.phone_number && profile.role);
  }, [profile]);

  return {
    user,
    userId,
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    displayName,
    isProfileComplete,
  };
};

export default useCustomerProfile;
