import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllBanks = createAsyncThunk(
  "users bank",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/fiat/banks",
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

export const verifyBank = createAsyncThunk(
  "users bank",
  async (
    bankDetails: { accountNumber: string; bankCode: string },
    { rejectWithValue }
  ) => {
    try {
      console.log(bankDetails);

      const response = await axios.post(
        "http://localhost:5000/api/v1/fiat/fund/verify",
        {
          accountNumber: bankDetails.accountNumber,
          bankCode: bankDetails.bankCode,
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const initialBankState:any = {
  verifiedBank:{},
  message: "",
  recipiet: false,
  error: null,
  loading: false,
  success: false,
};
const initialState = {
  allBanks: [],
  tonBalance: "",
  loading: false,
  error: null,
  success: false,
};

const getAllBanksSlice = createSlice({
  name: "getAllBanks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBanks = action.payload?.data.data;

        state.success = true;
      })
      .addCase(getAllBanks.rejected, (state) => {
        state.loading = false;
      });
  },
});

const verifyBanksSlice = createSlice({
  name: "verifyBanks",
  initialState: initialBankState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedBank = action.payload?.data;

        state.success = true;
      })
      .addCase(getAllBanks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const bankReducer = {
  getAllBanksSlice: getAllBanksSlice.reducer,
  verifyBanksSlice: verifyBanksSlice.reducer,
};
