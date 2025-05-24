import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerState {
  email: string;
  phone: string;
  gst: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

const initialState: SellerState = {
  email: "",
  phone: "",
  gst: "",
  otp: "",
  password: "",
  confirmPassword: "",
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setStepOneData(state, action: PayloadAction<Partial<SellerState>>) {
      Object.assign(state, action.payload);
    },
    setStepTwoData(state, action: PayloadAction<Partial<SellerState>>) {
      Object.assign(state, action.payload);
    },
    resetSellerData() {
      return initialState;
    },
  },
});

export const { setStepOneData, setStepTwoData, resetSellerData } = sellerSlice.actions;
export default sellerSlice.reducer;
