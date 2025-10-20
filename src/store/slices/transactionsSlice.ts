import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
  import axios from "axios";

  // Define deposit type
  export interface Deposit {
    depositID: string;
    login: string;
    open_time: string;
    profit: string;
    comment: string;
    source: string;
  }

  export interface Withdraw {
    depositID: string;
    login: string;
    open_time: string;
    profit: string;
    comment: string;
    source: string;
  }

  export interface Bonus {
    depositID: string;
    login: string;
    open_time: string;
    profit: string;
    comment: string;
    source: string;
  }

  // Full API response structure
  export interface TransactionsResponse {
    deposits: Deposit[];
    withdrawals: Withdraw[];
    bonuses: Bonus[];
    status: string;
    status_code: string;
    MT5_account: string;
    lead_id: string;
  }

  // Define Redux state shape
  interface TransactionsState {
    data: TransactionsResponse | null;
    loading: boolean;
    error: string | null;
  }

  // Initial state
  const initialState: TransactionsState = {
    data: null,
    loading: false,
    error: null,
  };

  // Async thunk to fetch transactions
  export const getTransactions = createAsyncThunk<
    TransactionsResponse,
    { account_number: string; access_token: string; platform?: string; start_date?: string; end_date?: string },
    { rejectValue: string }
  >(
    "transactions/getTransactions",
    async (
      { account_number, access_token, platform = "MT5", start_date, end_date },
      { rejectWithValue }
    ) => {
      try {
        const formData = new URLSearchParams();
        formData.append("request", "GetTransactions");
        formData.append("access_token", access_token);
        formData.append("account_number", account_number);
        formData.append("platform", platform);
        if (start_date) formData.append("start_date", start_date);
        if (end_date) formData.append("end_date", end_date);

        const response = await axios.post<TransactionsResponse>(
          "/api/transactions",
          formData.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (response.data.status_code !== "1") {
          return rejectWithValue("Failed to fetch transactions");
        }

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.message || error.message);
        } else if (error instanceof Error) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue("An unexpected error occurred");
        }
      }
    }
  );

  // Slice
  const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
      clearTransactions(state) {
        Object.assign(state, initialState);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getTransactions.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(
          getTransactions.fulfilled,
          (state, action: PayloadAction<TransactionsResponse>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
          }
        )
        .addCase(getTransactions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? "Something went wrong";
        });
    },
  });

  export const { clearTransactions } = transactionsSlice.actions;
  export default transactionsSlice.reducer;
