import fiatWalletModel from "../models/fiatWalletModel.js";
import { getWalletBalance } from "../controllers/wallet.js";
import { request as _request } from "https";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import fiatTransactionModel from "../models/fiatTransactionModel.js";

const fundFiatWallet = async (req, res) => {
  const session = await fiatWalletModel.startSession(); // Start a session for transactions
  session.startTransaction();

  try {
    const { amt: amount, user, email, name, quantity, token } = req.body;

    // Validate input
    if (!amount || !user) {
      return res.status(400).json({ message: "Amount and user are required." });
    }

    // Parse amount to ensure it's numeric
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    // Find wallet for the user
    const findWallet = await fiatWalletModel.findOne({ user }).session(session);

    // Check if wallet exists
    if (!findWallet) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Wallet not found for the user." });
    }

    // Update wallet balance atomically
    findWallet.balance = (findWallet.balance || 0) + numericAmount;
    await findWallet.save({ session });

    await fiatTransactionModel.create({
      amount,
      user,
      email,
      name,
      status: "Received",
      token,
      quantity,
    });
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with updated wallet
    res.status(200).json({
      message: "funded successfully.",
    });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error funding wallet:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getUserWallet = async (req, res) => {
  const user = req.user;

  const wallet = await fiatWalletModel.findOne({ user });
  const tonBalance = await getWalletBalance(user);
  return res.status(200).json({ wallet, tonBalance });
};

const verifyAcct = async (req, res) => {
  const https = require("https");

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/bank/resolve?account_number=7073502362&bank_code=058",
    method: "GET",
    headers: {
      Authorization: "Bearer SECRET_KEY",
    },
  };

  https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
};

const sendFiat = async ({ amount, recipient, reason, vendorId }) => {
  try {
    // Validate inputs
    if (!amount || !recipient || !reason || vendorId) {
      return { message: "All fields are required." };
    }

    const vendor = await fiatWalletModel.findOne({ user: vendorId });
    if (!vendor) {
      return { message: "invalid Id" };
    }
    if (amount > vendor.balance) {
      return { message: "insurficient funds " };
    }
    // Generate a unique reference for the transaction
    const randomUUID = uuidv4();

    // Define the request parameters
    const params = JSON.stringify({
      source: "balance",
      amount,
      // : 200, // Use dynamic amount from request
      reference: randomUUID,
      recipient,
      // : "RCP_r1cs1iu1rpo5cp6", // Use dynamic recipient from request
      reason: "holiday", // Use dynamic reason from request
    });

    // Define HTTPS options
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transfer",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SECRET}`, // Use environment variable
        "Content-Type": "application/json",
      },
    };

    // Send HTTPS request
    const request = _request(options, (response) => {
      let data = "";

      // Collect response data
      response.on("data", (chunk) => {
        data += chunk;
      });

      // Handle the response
      response.on("end", () => {
        const parsedData = JSON.parse(data);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return {
            message: "fiat Transfer successful!",
            data: parsedData,
          };
        } else {
          return {
            message: "fiat Transfer failed.",
            error: parsedData,
          };
        }
      });
    });

    // Handle request errors
    request.on("error", (error) => {
      console.error("Request Error:", error);
      return { message: "Internal server error.", error: error.message };
    });

    // Write parameters to the request body
    request.write(params);
    request.end();
  } catch (error) {
    // Catch any other errors
    console.error("Error in sendFiat:", error);
    return { message: "Internal server error.", error: error.message };
  }
};

const transactions = async (req, res) => {
  try {
    const user = req.user;

    const history = await fiatTransactionModel.find({ user });

    return res.status(200).json({ history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error getting transactions" });
  }
};

export { fundFiatWallet, getUserWallet, sendFiat, verifyAcct, transactions };
