import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Define the async thunk
export const getBuyerUserData = createAsyncThunk(
  "getBuyerUserData",
  async (profilesId:string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/v1/user/details/${profilesId}`
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
    
  }
);

interface BuyerUserData {
  userData: {
    tonRate: number;
    usdtRate: number;
    user: string; 
  };
  loading: boolean;
  error: any;
  success: boolean;
}


const initialState: BuyerUserData = {
  userData: {
    tonRate: 0,
    usdtRate: 0,
    user: "",
  },
  loading: false,
  error: null,
  success: false,
};

const getBuyerUserDataSlice = createSlice({
  name: "getBuyerUserData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuyerUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBuyerUserData.fulfilled, (state, action) => {
        
        
        state.loading = false;     
        state.userData = action.payload.data.user;

      })
      .addCase(getBuyerUserData.rejected, (state) => {
        state.loading = false;
       
      });
  },
});


// export const { updateFormData, resetState } = getBuyerUserDataSlice.actions;
export default getBuyerUserDataSlice.reducer;
