// store/slices/accountsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TpAccountSnapshot } from "@/types/user-details";

interface AccountsState {
  data: TpAccountSnapshot[];
  balance: number;
}

const initialState: AccountsState = {
  data: [],
  balance: 0,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<TpAccountSnapshot[]>) => {
      state.data = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    clearAccounts: (state) => {
      state.data = [];
      state.balance = 0;
    },
  },
});

export const { setAccounts, clearAccounts, setBalance } = accountsSlice.actions;
export default accountsSlice.reducer;
