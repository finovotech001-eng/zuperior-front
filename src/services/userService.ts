import api from "@/lib/axios";
import type { UserProfileResponse } from "@/types/user-profile";

export async function fetchUserProfile() {
  const response = await api.get<UserProfileResponse>("/user/profile");
  return response.data;
}
