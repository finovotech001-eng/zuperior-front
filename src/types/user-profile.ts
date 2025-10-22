export interface UserProfile {
  id: string;
  clientId: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}
