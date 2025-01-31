import { formatDataForBarChart } from "@/utils/transformTransactionData";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const transactions = createAsyncThunk(
  "transactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/transactions",
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

interface Transaction {
  name: string;
  token: string;
  quantity: number;
  status: string;
  amount: number;
  createdAt: string;
 
}

interface TransactionState {
  history: Transaction[];
  chartData:any; 
  loading: boolean;
  success: boolean;
  error: any;
}

const initialState: TransactionState = {
  history: [], // Initialize as an empty array
  loading: false,
  chartData:[],
  success: false,
  error: false,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(transactions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(transactions.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data.history;
       state.chartData = formatDataForBarChart(action.payload.data.history);
       console.log(state.chartData);
       
        state.success = true;
      })
      .addCase(transactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionsSlice.reducer;
