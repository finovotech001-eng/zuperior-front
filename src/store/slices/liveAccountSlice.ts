// store/slices/registerThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface AdditionalLiveAccountPayload {
  access_token: string;
  platform_name: string;
  currency: string;
  password: string;
  crm_account_id: number;
  account_type_requested: string;
  nickname: string;
  leverage: string;
}

interface AdditionalLiveAccountResponse {
  mt4_account?: string;
  server_number?: number;
  status: string;
  status_code: string;
  message: string;
  _token: string;
  object: {
    crm_account_id: number;
    crm_tp_account_id: number;
    tp_id: string;
    tp_creation_error: string;
  };
}

export const createAdditionalLiveAccount = createAsyncThunk<
  AdditionalLiveAccountResponse,
  AdditionalLiveAccountPayload,
  { rejectValue: string }
>("auth/createAdditionalLiveAccount", async (data, { rejectWithValue }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("request", "CreateAdditionalLiveAccount");
    formData.append("access_token", data.access_token);
    formData.append("platform_name", data.platform_name);
    formData.append("currency", data.currency);
    formData.append("password", data.password);
    formData.append("crm_account_id", data.crm_account_id.toString());
    formData.append("account_type_requested", data.account_type_requested);
    formData.append("nickname", data.nickname);
    formData.append("requested_leverage", data.leverage);

    const response = await axios.post(
      "/api/create-account",
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data as AdditionalLiveAccountResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create additional account"
      );
    } else if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue("Unknown error");
    }
  }
});
