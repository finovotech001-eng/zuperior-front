// tokenThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAccessToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("token/fetchAccessToken", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/access-token", null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.data?.access_token) {
      console.error("Access token not returned from API:", response.data);
      return rejectWithValue("Access token not returned");
    }

    console.log("✅ Access token fetched successfully");
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch token"
      );
    } else if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue("Unknown error occurred");
    }
  }
});
