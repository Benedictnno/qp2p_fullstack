import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userBalances = createAsyncThunk(
  "users balances",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/v1/fiat/fund",
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

export type userBalance = {
  fiatBalance: number;
  tonBalance: string;
  loading: boolean,
  error: string | null | unknown;
  success: boolean;
};

const initialState: userBalance = {
  fiatBalance: 0,
  tonBalance: '',
  loading: false,
  error: null,
  success: false,
};

const userBalancesSlice = createSlice({
  name: "userBalances",
  initialState,
  reducers: {},
  extraReducers:  (builder) => {
    builder
      .addCase(userBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userBalances.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload?.data);
        
        state.fiatBalance = action.payload?.data.wallet.balance
        state.tonBalance = action.payload?.data.tonBalance.balance
        state.success = true;

      })
      .addCase(userBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userBalancesSlice.reducer;
