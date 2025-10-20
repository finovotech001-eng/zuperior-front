// store/slices/registerThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterPayload {
  access_token: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  platform_name: string;
  country_code: string;
  // account_type?: string; // Add if your API needs this field
  ip: string;
}

interface RegisterResponse {
  message: string;
  status?: string;
  status_code?: string;
  _token: string;
  email: string; // <-- add this
  object: {
    crm_account_id: number;
    crm_tp_account_id: number;
    mt4_id: string;
    tp_id: string;
    tp_creation_error: string;
  };
}

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const formData = new URLSearchParams();
    //const countryCode = data.country_code || "";
    //const phoneWithoutCode = data.phone.replace(`${countryCode}`, "");
    formData.append("request", "CreateLiveAccount");
    formData.append("access_token", data.access_token);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    //formData.append("phone", phoneWithoutCode);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("country", data.country);
    formData.append("platform_name", data.platform_name);
    formData.append("account_type_requested", "standard");

    // if (data.account_type) {
    //   formData.append("account_type", data.account_type);
    // }

    formData.append("ip", data.ip);

    const response = await axios.post("/api/register", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.status_code !== "1") {
      return response.data;
    }

    return {
      ...response.data,
      email: data.email, // manually include email
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    } else if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue("Unknown registration error");
    }
  }
});
