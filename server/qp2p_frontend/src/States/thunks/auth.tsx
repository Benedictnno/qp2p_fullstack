import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";

dotenv.config();

export const LoginUser = createAsyncThunk(
  "Login user",
  async (login: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email: login.email, password: login.password },
        { withCredentials: true }
      );

      const user = jwtDecode(response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loginTime", JSON.stringify(Date.now()));

      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
export const RegisterUser = createAsyncThunk(
  "register user",
  async (
    login: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          email: login.email,
          password: login.password,
          lastName: login.lastName,
          firstName: login.lastName,
        },
        { withCredentials: true }
      );
      const user = jwtDecode(response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loginTime", JSON.stringify(Date.now()));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export type Login = {
  user: any;
  loading: boolean;
  error: string | null | unknown;
  success: boolean;
};
export type RegisterUserState = {
  email: string;
  msg: string;
  loading: boolean;
  error: string | null | unknown;
  success: boolean;
};

const initialState: Login = {
  user: "",
  loading: false,
  error: null,
  success: false,
};
const RegisterUserState: RegisterUserState = {
  email: "",
  msg: "",
  loading: false,
  error: null,
  success: false,
};

const LoginUserSlice = createSlice({
  name: "LoginUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const RegisterUserSlice = createSlice({
  name: "Register User",
  initialState: RegisterUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.msg = action.payload.message;
        state.success = true;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;      
        state.success = false;
      });
  },
});

export const reducers = {
  loginUser: LoginUserSlice.reducer,
  registerUser: RegisterUserSlice.reducer,
};
