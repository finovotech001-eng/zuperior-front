import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

  // Define deposit type
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

export interface Bonus {
  depositID: string;
  login: string;
  open_time: string;
  profit: number;
  comment: string;
  source: string;
  status?: string;
}

export interface MT5Transaction {
  depositID: string;
  login: string;
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
  account_number: string;
  start_date?: string;
  end_date?: string;
};

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

      console.log('🚀 Redux: Calling /transactions/database with params:', params.toString());

      const response = await api.get<{
        success: boolean;
        message: string;
        data: TransactionsResponse;
      }>(
        `/transactions/database?${params.toString()}`
      );

      console.log('📦 Redux: API response:', response.data);

      if (!response.data.success) {
        console.error('❌ Redux: API returned failure:', response.data.message);
        return rejectWithValue(response.data.message || "Failed to fetch transactions");
      }

      console.log('✅ Redux: Successfully fetched transactions');
      return response.data.data;
    } catch (error) {
      console.error('❌ Redux: Error in getTransactions thunk:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
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
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
