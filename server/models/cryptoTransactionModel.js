import { Schema, Types, model } from "mongoose";

const CryptoTransactionSchema = new Schema(
  {
    Amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    crypto: {
      type: Number,
      enum: ["Ton", "Usdt"],
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["Received", "sent"],
      required: true,
    },
    verified: {
      type: Boolean,
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

export default model(
  "CryptoTransaction",
  CryptoTransactionSchema
);
