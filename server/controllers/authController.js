import bcryptjs from "bcryptjs";
import userModel from "../models/userModel.js";
import fiatWalletModel from "../models/fiatWalletModel.js";
import { generateAccessToken, generateRefreshToken, generateVerificationToken } from "../middleware/auth_services.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // Accept role from request

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email }).select("email");
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Error registering user, email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    // Create a new user
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user", // Default to "user" if role is not provided
    });
    const verificationToken = generateVerificationToken(user._id);
    sendVerificationEmail(user.email, verificationToken);
    // Return response with specific fields


  const setUser={
     email: user.email,
firstName:user.firstName,
id:user.id,
lastName:user.lastName
    }

    const accessToken = generateAccessToken(setUser);
  const refreshToken = generateRefreshToken(setUser);

  res.cookie("accessToken", accessToken, {
    //  sameSite: 'None',
    httpOnly: true,
    secure: false, // Use only with HTTPS
  });

 

    return res.status(201).json({
      email: user.email,
       // Explicitly return email and role
       refreshToken,
      message:
        "User registered successfully, an email has been sent to you please verify",
    });
  } catch (err) {
    console.error("Error registering user:", err.message); // Log error for debugging
    return res.status(500).json({ message: "Error registering user" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email,
    });
    const verificationToken = generateVerificationToken(user._id);
    sendVerificationEmail(user.email, verificationToken);
     return res.status(201).json({
       email: user.email, // Explicitly return email and role
       message:
         "an email has been sent to you please verify",
     });
  } catch (error) {
   console.error("Error registering user:", err.message); // Log error for debugging
    return res.status(500).json({ message: "Error registering user" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  const session = await userModel.startSession(); // Start a session for the transaction
  session.startTransaction();

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

    // Fetch the user using the ID from the token payload
    const findUser = await userModel.findById(decoded.id).session(session);

    if (!findUser) {
      throw new Error("User not found.");
    }

    if (findUser.verified) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ message: "Email is already verified." });
    }

    // Update user's verification status
    await userModel.findByIdAndUpdate(decoded.id, { verified: true }, { session });

    // Check if the user's wallet exists, and create if necessary
    const findWallet = await fiatWalletModel.findOne({ user: decoded.id }).session(
      session
    );

    if (!findWallet) {
      await fiatWalletModel.create([{ user: decoded.id }], { session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Success response
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    console.error("Email verification error:", error.message);

    // Handle specific token errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Verification token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // General error response
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const login = (req, res) => {
  const user = req.user;
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    //  sameSite: 'None',
    httpOnly: true,
    secure: false, // Use only with HTTPS
  });

  res.json({ refreshToken });
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret"
    );
    const newAccessToken = generateAccessToken(payload);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true }); // Adjust options based on your setup
  res.json({ message: "Logged out" });
};


export { registerUser, login, logout, refreshToken, verifyEmail };
