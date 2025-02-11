import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for the payload and thunk arguments
interface VerifyWalletArgs {
  customersAddress: string;
  value: number;
  vendorWalletId: string;
}

interface VerifyWalletResponse {
  success: boolean;
  message?: string; // Optional message in the response
}

interface FormData {
  crypto: string;
  customersAddress: string;
  value: number | string; // Can be a number or string during input
  vendorWalletId: string;
  email: string;
  Phone: string;
  name: string;
}

interface VerifyCryptoWalletState {
  formData: FormData;
  loading: boolean;
  burger: boolean;
  error: string | null;
  success: boolean;
}

// Define the initial state
const initialState: VerifyCryptoWalletState = {
  formData: {
    crypto: "TON",
    customersAddress: "",
    value: "",
    vendorWalletId: "",
    email: "",
    Phone: "",
    name: "",
  },
  burger: false,
  loading: false,
  error: null,
  success: false,
};

// Define the async thunk
export const verifySendersWallet = createAsyncThunk<
  VerifyWalletResponse, // Return type of the thunk
  VerifyWalletArgs, // Argument type for the thunk
  { rejectValue: string } // Rejection type
>(
  "crypto/verifySendersWallet",
  async ({ customersAddress, value, vendorWalletId }, { rejectWithValue }) => {
    console.log({ customersAddress, value, vendorWalletId });

    try {
      const response = await axios.post<VerifyWalletResponse>(
        "/api/v1/crypto/verify",
        {
          customersAddress,
          value,
          vendorWalletId,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during verification"
      );
    }
  }
);

// Create the slice
const verifyCryptoWalletSlice = createSlice({
  name: "verifyCryptoWallet",
  initialState,
  reducers: {
    // Reducer to update form data with payload typing
    updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    // Reducer to reset the state to its initial value
    resetState: () => initialState,
    Open: (state) => {
      state.burger = true;
    },
    Close: (state) => {
      state.burger = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifySendersWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        verifySendersWallet.fulfilled,
        (state, action: PayloadAction<VerifyWalletResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
        }
      )
      .addCase(
        verifySendersWallet.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An unknown error occurred";
        }
      );
  },
});

// Export actions and reducer
export const { updateFormData, resetState,Open,Close } = verifyCryptoWalletSlice.actions;
export default verifyCryptoWalletSlice.reducer;
