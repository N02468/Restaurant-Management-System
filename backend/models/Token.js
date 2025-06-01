// models/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }, // Optional: to prevent reuse
});

export default mongoose.model("Token", tokenSchema);
export { default as Token } from "./Token.js"; // for named exports
