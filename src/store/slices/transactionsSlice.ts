import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

/** Types from your UI */
export interface Deposit {
  depositID: string;
  login: string;
  open_time: string;
  profit: number;
  comment: string;
  source: string;
  status?: string;
}

export interface Withdraw {
  depositID: string;
  login: string;
  open_time: string;
  profit: number;
  comment: string;
  source: string;
  status?: string;
}

export interface MT5Transaction {
  id: string;
  login: string | number;
  open_time: string;
  amount: number;
  profit: number;
  comment: string;
  type: string;
  status?: string;
}

export interface Bonus {
  id: string;
  login: string | number;
  open_time: string;
  profit: number;
  comment: string;
  source: string;
  status?: string;
  type: string;
}

export interface TransactionsResponse {
  deposits: Deposit[];
  withdrawals: Withdraw[];
  mt5Transactions: MT5Transaction[];
  bonuses: Bonus[];
  status: string;
  MT5_account: string;
}

interface TransactionsState {
  data: TransactionsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  data: null,
  loading: false,
  error: null,
};

type GetTransactionsArgs = {
  account_number: string;     // MT5 login from the page
  start_date?: string;        // yyyy-MM-dd
  end_date?: string;          // yyyy-MM-dd
};

/**
 * Calls /transactions/database with query params (GET).
 * If the server responds 405 (method not allowed), retries with POST + JSON body.
 * This makes the frontend resilient to server routing differences.
 */
export const getTransactions = createAsyncThunk<
  TransactionsResponse,
  GetTransactionsArgs,
  { rejectValue: string }
>(
  "transactions/getTransactions",
  async ({ account_number, start_date, end_date }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        accountId: account_number,
        ...(start_date ? { startDate: start_date } : {}),
        ...(end_date ? { endDate: end_date } : {}),
      });

      // First try GET
      try {
        const response = await api.get<{
          success: boolean;
          message: string;
          data: TransactionsResponse;
        }>(`/transactions/database?${params.toString()}`);

        if (!response.data?.success) {
          return rejectWithValue(response.data?.message || "Failed to fetch transactions");
        }
        return response.data.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status !== 405) throw err; // rethrow non-405 errors
      }

      // Fallback to POST if GET not allowed
      const postResponse = await api.post<{
        success: boolean;
        message: string;
        data: TransactionsResponse;
      }>(`/transactions/database`, {
        accountId: account_number,
        startDate: start_date,
        endDate: end_date,
      });

      if (!postResponse.data?.success) {
        return rejectWithValue(postResponse.data?.message || "Failed to fetch transactions");
      }
      return postResponse.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Something went wrong"
      );
    }
  }
);

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
        state.error = (action.payload as string) ?? "Something went wrong";
      });
  },
});

export const { clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
