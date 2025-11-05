import api from "@/lib/axios";
import type { UserProfileResponse } from "@/types/user-profile";

export async function fetchUserProfile() {
  try {
    // Try Next.js API route first (more reliable in development)
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserProfileResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    // Fallback: try direct backend API call
    try {
      const response = await api.get<UserProfileResponse>("/profile");
      return response.data;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}
