import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const ProfilesDetails = createAsyncThunk(
  "Profiles Details",
  async (
    profilesDetails: {
      businessName: string;
      accountName: string;
      accountNumber: string;
      bankName: string;
      tonRate: string;
      usdtRate: string;
      bio: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/details",
        {
          businessName: profilesDetails.businessName,
          accountName: profilesDetails.accountName,
          accountNumber: profilesDetails.accountNumber,
          bankName: profilesDetails.bankName,
          bio: profilesDetails.bio,
          tonRate: Number(profilesDetails.tonRate),
          usdtRate: Number(profilesDetails.usdtRate),
        },
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
  businessName: string;
  accountNumber: string;
  bankName: string;
  tonRate: number | null;
  usdtRate: number | null;
  loading: boolean;
  error: string | null | unknown;
  success: boolean;
};

const initialState: userBalance = {
  businessName: "",
  accountNumber: "",
  bankName: "",
  tonRate: 0,
  usdtRate: 0,
  loading: false,
  error: null,
  success: false,
};

const ProfilesDetailsSlice = createSlice({
  name: "ProfilesDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProfilesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ProfilesDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(ProfilesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Update details
export const UpdateProfilesDetails = createAsyncThunk(
  "Update Profiles Details",
  async (
    UpdateProfilesDetails: {
      businessName: string;
      accountName: string;
      accountNumber: number;
      bankName: string;
      tonRate: number;
      usdtRate: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/details",
        {
          businessName: UpdateProfilesDetails.businessName,
          accountName: UpdateProfilesDetails.accountName,
          accountNumber: Number(UpdateProfilesDetails.accountNumber),
          bankName: UpdateProfilesDetails.bankName,
          tonRate: Number(UpdateProfilesDetails.tonRate),
          usdtRate: Number(UpdateProfilesDetails.usdtRate),
        },
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

const UpdateDetailsState: userBalance = {
  businessName: "",
  accountNumber: "",
  bankName: "",
  tonRate: 0,
  usdtRate: 0,
  loading: false,
  error: null,
  success: false,
};

const UpdateProfilesDetailsSlice = createSlice({
  name: "UpdateProfilesDetailsSlice",
  initialState: UpdateDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProfilesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ProfilesDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(ProfilesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const profileReducers = {
  ProfileDetails: ProfilesDetailsSlice.reducer,
  UpdateProfilesDetails: UpdateProfilesDetailsSlice.reducer,
};
