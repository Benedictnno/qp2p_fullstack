import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendFiat = createAsyncThunk(
  "users bank",
  async (
    Details: {
      coin: string;
      amount: number;
      sendersAddress: string;
      ReceivingWalletAddress: string;
      recipient: string;
      vendorId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log({...Details});

      const response = await axios.post(
        "/api/v1/verifyTransactionAndSendFiat",
        {
          ...Details,
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const initialState = {
  message: "",
  loading: false,
  error: null,
  success: false,
};

const sendFiatSlice = createSlice({
  name: "sendFiat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFiat.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendFiat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.data.message;

        state.success = true;
      })
      .addCase(sendFiat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const sendFiatReducer = {
  sendFiatSlice: sendFiatSlice.reducer,
};