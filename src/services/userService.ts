import api from "@/lib/axios";
import type { UserProfileResponse } from "@/types/user-profile";

export async function fetchUserProfile() {
  // First attempt: Next.js API route
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data: UserProfileResponse = await response.json();
      return data;
    }
    // Non-OK -> fall through to backend call instead of throwing
    console.warn(`Profile API route returned ${response.status}, falling back to backend`);
  } catch (error) {
    console.warn('Profile API route call failed, falling back to backend:', error);
  }

  // Fallback: direct backend API call with axios (injects Authorization)
  try {
    const response = await api.get<UserProfileResponse>("/user/profile");
    return response.data;
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError);
    throw fallbackError;
  }
}
