import { Schema, Types, model } from "mongoose";

const fiatWalletSchema = new Schema(
  {
    balance: {
      type: Number,
      required: true,
      default: 0.0,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("fiatWallet", fiatWalletSchema);
