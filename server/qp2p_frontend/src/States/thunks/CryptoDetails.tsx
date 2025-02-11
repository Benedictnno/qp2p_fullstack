import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const TonAddress = createAsyncThunk(
  "Ton Wallet Address",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/v1/crypto/TonAddress/${id}`,
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
export const TonMnemonics = createAsyncThunk(
  "Ton Wallet mnemonic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/v1/crypto/TonMnemonic",
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export type TonAddressType = {
  walletAddress: string;
  loading: boolean;
  error: string | null | unknown;
  success: boolean;
};

const addressInitialState: TonAddressType = {
  walletAddress: "",
  loading: false,
  error: null,
  success: false,
};

const TonAddressSlice = createSlice({
  name: "TonAddress",
  initialState: addressInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(TonAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(TonAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAddress = action.payload.data.walletAddress;
        state.success = true;
      })
      .addCase(TonAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// get mnemonics
export type TonMnemonicsType = {
  mnemonics: string;
  loading: boolean;
  error: string | null | unknown;
  success: boolean;
};

const mnemonicsInitialState: TonMnemonicsType = {
  mnemonics: "",
  loading: false,
  error: null,
  success: false,
};

const TonMnemonicsSlice = createSlice({
  name: "TonMnemonics",
  initialState: mnemonicsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(TonMnemonics.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(TonMnemonics.fulfilled, (state, action) => {
        state.loading = false;
        state.mnemonics = action.payload.data.mnemonic;
        state.success = true;
      })
      .addCase(TonMnemonics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const TonWalletReducers = {
  TonAddressSlice: TonAddressSlice.reducer,
  TonMnemonicsSlice: TonMnemonicsSlice.reducer,
};
