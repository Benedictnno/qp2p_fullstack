import  bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userModel from "../models/userModel.js";
dotenv.config();
// Replace with database or in-memory storage

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const VERIFICATION_TOKEN_SECRET = process.env.VERIFICATION_TOKEN_SECRET;

const findUserByEmail = async (email) => {
  return userModel.find({ email }) || null;
};

const validatePassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

function generateVerificationToken(userId) {
  return jwt.sign({ id: userId }, VERIFICATION_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}
export  {
  generateVerificationToken,
  findUserByEmail,
  validatePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
