import { KYCState } from "@/types/kyc";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: KYCState = {
  isDocumentVerified: false,
  isAddressVerified: false,
  verificationStatus: "unverified",
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    /* setAMLReference: (state, action: PayloadAction<string>) => {
      state.amlReference = action.payload;
    },
    setDocumentReference: (state, action: PayloadAction<string>) => {
      state.documentReference = action.payload;
    },
    setAddressReference: (state, action: PayloadAction<string>) => {
      state.addressReference = action.payload;
    }, */
    setDocumentVerified: (state, action: PayloadAction<boolean>) => {
      state.isDocumentVerified = action.payload;
      state.verificationStatus = getVerificationStatus(
        state.isDocumentVerified,
        state.isAddressVerified
      );
    },
    setAddressVerified: (state, action: PayloadAction<boolean>) => {
      state.isAddressVerified = action.payload;
      state.verificationStatus = getVerificationStatus(
        state.isDocumentVerified,
        state.isAddressVerified
      );
    },
    resetKYC: () => initialState, // useful on logout if needed
  },
});

const getVerificationStatus = (
  isDocumentVerified: boolean,
  isAddressVerified: boolean
): "unverified" | "partial" | "verified" => {
  if (isDocumentVerified && isAddressVerified) return "verified";
  if (isDocumentVerified || isAddressVerified) return "partial";
  return "unverified";
}

export const {
  setDocumentVerified,
  setAddressVerified,
  resetKYC,
} = kycSlice.actions;

export default kycSlice.reducer;
