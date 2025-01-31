import { Schema, Types, model } from "mongoose";

const FiatTransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Received", "sent","By You"],
      required: true,
    },
   
    token: {
    
      type: String,
      enum: ["TON", "USDT","Funded Account"],

      required: true,
    },
    quantity: {
    
      type: Number,
      

      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("fiatTransaction", FiatTransactionSchema);
