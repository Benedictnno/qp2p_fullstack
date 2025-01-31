import { Schema, Types, model } from "mongoose";

const CryptoWalletSchema = new Schema(
  {
    mnemonic: {
      type: String,
      required: true,
    },
    // publicKey: {
    //   type: String,
    //   required: true,
    // },
    // privateKey: {
    //   type: String,
    //   required: true,
    // },
    walletAddress: {
      type: String,
      required: true,
      minLength: 48,
      maxLength: 48,
    },
    tonBalance: {
      type: Number,
      required: true,
      default: 0.00,
    },
    usdtBalance: {
      type: Number,
      required: true,
      default: 0.00,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("cryptowallets", CryptoWalletSchema);
