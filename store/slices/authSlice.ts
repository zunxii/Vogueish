// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { buyerSignInSchema, buyerSignUpSchema, sellerStep1Schema, sellerStep2Schema } from '@/schemas/authSchema';

// Types
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
    role?: 'buyer' | 'seller';
  } | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  step1Data: {
    email: string;
    phone: string;
    gst: string;
    otp: string;
  } | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  otpSent: false,
  step1Data: null,
};

// Async Thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phone: string, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Failed to send OTP');
      }
      
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const sellerStep1 = createAsyncThunk(
  'auth/sellerStep1',
  async (data: z.infer<typeof sellerStep1Schema>, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/seller/sign-up/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(result.error || 'Failed to complete step 1');
      }
      
      return { ...result, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const sellerStep2 = createAsyncThunk(
  'auth/sellerStep2',
  async (data: z.infer<typeof sellerStep2Schema>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const step1Data = state.auth.step1Data;
      
      if (!step1Data) {
        return rejectWithValue('Step 1 data is missing. Please complete step 1 first.');
      }
      
      const response = await fetch('/api/auth/seller/sign-up/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, step1Data }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(result.error || 'Failed to complete registration');
      }
      
      return result;
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const buyerSignIn = createAsyncThunk(
  'auth/buyerSignIn',
  async (data: z.infer<typeof buyerSignInSchema>, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/buyer/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(result.error || 'Invalid email or password');
      }
      
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const sellerSignIn = createAsyncThunk(
  'auth/sellerSignIn',
  async (data: z.infer<typeof buyerSignInSchema>, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/seller/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(result.error || 'Invalid email or password');
      }
      
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const buyerSignUp = createAsyncThunk(
  'auth/buyerSignUp',
  async (data: z.infer<typeof buyerSignUpSchema>, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/buyer/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue(result.error || 'Failed to create account');
      }
      
      // Automatically sign in after successful sign up
      return thunkAPI.dispatch(buyerSignIn({ 
        email: data.email, 
        password: data.password 
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        return thunkAPI.rejectWithValue('Failed to logout');
      }
      
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    clearStep1Data: (state) => {
      state.step1Data = null;
    }
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state) => {
      state.isLoading = false;
      state.otpSent = true;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Seller Step 1
    builder.addCase(sellerStep1.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sellerStep1.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.step1Data = {
        email: action.payload.email,
        phone: action.payload.phone,
        gst: action.payload.gst,
        otp: action.payload.otp,
      };
    });
    builder.addCase(sellerStep1.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Seller Step 2
    builder.addCase(sellerStep2.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sellerStep2.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.userId,
        email: state.step1Data?.email,
        role: 'seller',
      };
      state.step1Data = null;
    });
    builder.addCase(sellerStep2.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Buyer Sign In
    builder.addCase(buyerSignIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(buyerSignIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.userId,
        email: action.payload.email,
        name: action.payload.name,
        role: 'buyer',
      };
    });
    builder.addCase(buyerSignIn.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Seller Sign In
    builder.addCase(sellerSignIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sellerSignIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.userId,
        email: action.payload.email,
        name: action.payload.name,
        role: 'seller',
      };
    });
    builder.addCase(sellerSignIn.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.step1Data = null;
    });
  },
});

export const { resetAuth, clearStep1Data } = authSlice.actions;
export default authSlice.reducer;