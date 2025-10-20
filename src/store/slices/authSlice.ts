// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { registerUser } from "@/store/slices/registerSlice";

interface AuthState {
  token: string | null;
  clientId: string | null;
  loading: boolean;
  error: string | null;
  passwordMask: string; // Add this for display purposes
}

const initialState: AuthState = {
  token: null,
  clientId: null,
  loading: false,
  error: null,
  passwordMask: "********", // Default masked password
};

export const loginUser = createAsyncThunk<
  { token: string; clientId: string }, 
  { email: string; password: string; accessToken: string }, 
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password, accessToken }, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("request", "Login");
      formData.append("access_token", accessToken);
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post("/api/login", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.status_code !== "1") {
        return rejectWithValue("Login failed");
      }

      return {
        token: response.data.object._token,
        clientId: response.data.object.account_email,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || error.message || "Login error"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.clientId = null;
      state.error = null;
      state.loading = false;
    },
    setPasswordMask(state, action: PayloadAction<string>) {
      state.passwordMask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.clientId = action.payload.clientId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload._token;
        state.clientId = action.payload.email; // store email as clientId
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export const { logout, setPasswordMask } = authSlice.actions;
export default authSlice.reducer;