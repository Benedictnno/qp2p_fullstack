import  userDetailsModel from "../models/userDetailsModel.js";
import  userModel from "../models/userModel.js";
import { getWalletBalance } from "./wallet.js";

const usersDetails = async (req, res) => {
  const {
    businessName,
    accountNumber,
    accountName,
    bankName,
    usdtRate,
    tonRate,
    bio
  } = req.body;

  const { _id: id } = req.user;

  try {
    // Validate input
    if (!businessName || !accountNumber || !accountName || !bankName) {
      return res.status(400).json({
        message: "All fields are required to register user details.",
      });
    }

    // Ensure the user exists
    const userExists = await userModel.findById(id);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Prevent duplicate entries (Optional)
    // const existingDetails = await UserDetailsModel.userDetailsModel.findOneAndUpdate({ user: id });
    // if (existingDetails) {
    //   return res.status(201).json({
    //     userDetails: existingDetails,
    //   });
    // }

    // userDetailsModel.Create new user details
    await userDetailsModel.create({
      businessName,
      accountNumber,
      accountName,
      bankName,
      user: id,
      usdtRate,
      tonRate,
      bio
    });

    return res.status(201).json({
      message: "User details registered successfully.",
    });
  } catch (error) {
    console.error("Error registering user details:", error); // Improve logging in production
    return res.status(500).json({
      message: "An error occurred while registering user details.",
    });
  }
};
const updateUsersDetails = async (req, res) => {
  const {
    businessName,
    accountNumber,
    accountName,
    bankName,
    usdtRate,
    tonRate,
    bio
  } = req.body;

  const { _id: id } = req.user;

  try {
    // Ensure the user exists
    const userExists = await userModel.findById(id);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    // update user details
    await userDetailsModel.create({
      businessName,
      accountNumber,
      accountName,
      bankName,
      user: id,
      usdtRate,
      bio,
      tonRate,
    });

    return res.status(201).json({
      message: "User details updated successfully.",
    });
  } catch (error) {
    console.error("Error registering user details:", error); // Improve logging in production
    return res.status(500).json({
      message: "An error occurred while registering user details.",
    });
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;

  const userDetails = await userDetailsModel.findOne({ user: id }).select(
    "user usdtRate tonRate"
  );
  if (!userDetails) {
    return res.status(404).json({
      error: "User with details does't exist.",
    });
  }
  await getWalletBalance("67561a33e108be5e56e15a71");
  res.status(200).json({
    user: userDetails,
  });
};
const getUserFullDetails = async (req, res) => {
  const { _id: id } = req.user;

  const userExists = await userDetailsModel.findOne({user:id});
  if (!userExists) {
    return res.status(404).json({
      message: "User not found.",
    });
  }
  return res.status(200).json({
    userDetails: userExists,
  });
};

export  {
  usersDetails,
  getUserDetails,
  getUserFullDetails,
  updateUsersDetails,
};
