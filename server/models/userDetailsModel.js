import { Schema, Types, model } from "mongoose";

const UserDetailsSchema = new Schema({
  businessName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },

  accountName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    
  },
  walletId: {
    type: String,

  },
  tonRate: {
    type: Number,
  },
  usdtRate: {
    type: Number,
  },
  user: {
    type: Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export default model("UserDetails", UserDetailsSchema);
