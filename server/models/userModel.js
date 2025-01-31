import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Role field
 verified:{type:Boolean}
});

export default model("User", UserSchema);
