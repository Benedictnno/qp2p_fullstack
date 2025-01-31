import TonWeb from "tonweb";
import crypto from "@ton/crypto";
import ton from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
const { mnemonicToWalletKey } = crypto;
const { WalletContractV4, TonClient, fromNano, internal } = ton;
import fetch from "node-fetch";
import cryptoWalletModel from "../models/cryptoWalletModel.js";
import fiatWalletModel from "../models/fiatWalletModel.js";
import { decryptMnemonic } from "../utils/storeMnemonics.js";
import { getWalletBalance } from "./wallet.js";
import { getTransactionHistory } from "../cryptoUtils/transactionHistory.js";
import userDetailsModel from "../models/userDetailsModel.js";
import { sendFiat } from "./fiatWalletController.js";

// Initialize Tonweb with a reliable Lite Server

const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC")
);

const apiKey = process.env.TON_SECRET; // Add your TON API key to .env file

// Unified function to fetch wallet info (balance + transactions)
async function getWalletInfo(tonweb, walletAddress, apiKey) {
  try {
    // Fetch wallet balance
    const balanceNano = await tonweb.getBalance(walletAddress);
    const balanceTon = TonWeb.utils.fromNano(balanceNano);

    // Fetch transaction history (Tonweb or API fallback)
    let transactionHistory = [];
    try {
      transactionHistory = await tonweb.getTransactions(walletAddress);
    } catch (tonwebError) {
      console.warn("Tonweb failed to fetch transactions. Falling back to API.");

      const response = await fetch(
        `https://toncenter.com/api/v2/getTransactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: walletAddress,
            limit: 20,
            api_key: apiKey,
          }),
        }
      );

      const data = await response.json();
      if (data.ok) {
        transactionHistory = data.result;
      } else {
        console.error("API fallback failed:", data.error);
      }
    }

    return {
      balance: balanceTon,
      transactions: transactionHistory,
    };
  } catch (error) {
    console.error("Error fetching wallet info:", error.message);
    throw error;
  }
}

const tonwebFN = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: process.env.TON_SECRET, // Replace with your Toncenter API key if required
  })
);

// Wallet address to fetch transaction history
const walletAddress = "UQABsgi0sLTSX7xkmOsCmsxQnWA_PaxMibkSLzs5YuF_B7ej"; // Replace with the wallet address

async function fetchTransactionHistory() {
  try {
    // Retrieve transactions for the wallet
    const transactions = await tonwebFN.provider.getTransactions(walletAddress);

    // Process or display the transactions
    console.log("Transaction History:", transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
  }
}

// Call the function

const cryptoWallet = async (req, res) => {
  const walletAddress = req.query.walletAddress; // Pass the wallet address as a query parameter

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

  try {
    const walletInfo = await getWalletInfo(tonweb, walletAddress, apiKey);
    res.status(200).json({ wallet: walletInfo });
  } catch (error) {
    console.error("Error fetching wallet info:", error.message);
    res.status(500).json({ error: "Failed to retrieve wallet information." });
  }
};
const sendCrypto = async (req, res) => {
  const { to, value, user } = req.body;
  // const { user } = req.user;
  if (!to || !value || value <= 0.001) {
    return res.status(400).json({
      error: "Value must be more than 0.001 and all fields must be filled.",
    });
  }
  try {
    // Retrieve mnemonic from DB
    const userWallet = await cryptoWalletModel.findOne({
      user: user._id,
    });

    if (!userWallet || !userWallet.mnemonic) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    const balance = await getWalletBalance(user._id);

    if (value > Number(balance.balance)) {
      return res.status(404).json({ error: "insufficient funds" });
    }
    const mnemonic = decryptMnemonic(userWallet.mnemonic);

    const key = await mnemonicToWalletKey(mnemonic.split(" "));

    const wallet = WalletContractV4.create({
      publicKey: key.publicKey,
      workchain: 0,
    });

    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });
    const walletAddress = wallet.address;

    if (!(await client.isContractDeployed(walletAddress))) {
      const walletContract = client.open(wallet);
      // Deploy the wallet contract
      await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: await walletContract.getSeqno(),
        messages: [], // No messages needed for deployment
      });
      console.log("Wallet is deployed!");
    }

    const isDeployed = await client.isContractDeployed(walletAddress);
    if (isDeployed) {
      console.log("Wallet is deployed and ready to use!");
    } else {
      console.log("Wallet is not yet deployed.");
    }

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    await walletContract.sendTransfer({
      secretKey: key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to,
          value: String(value),
          body: "sent",
          bounce: false,
        }),
      ],
    });

    // Wait for the transaction to be confirmed
    let currentSeqno = seqno;
    while (currentSeqno === seqno) {
      console.log("Waiting for transfer confirmation...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      currentSeqno = await walletContract.getSeqno();
    }

    console.log("Transaction confirmed");
    return res.status(200).json({ success: "Transaction confirmed" });
  } catch (error) {
    console.error("Error sending crypto:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const receivedTonVerificationAndSendFiat = async (req, res) => {
  const session = await fiatWalletModel.startSession(); // Start a session for the transaction
  session.startTransaction();
  const {
    coin,
    amount,
    sendersAddress,
    ReceivingWalletAddress,
    recipient,
    reason,
    vendorId,
  } = req.body;

  try {
    const userDetails = await userDetailsModel.findOne({ user: vendorId });
    let fiatAmount;
    // Validate required fields
    if (
      !coin ||
      !amount ||
      amount < userDetails.tonRate ||
      !sendersAddress ||
      !ReceivingWalletAddress ||
      recipient
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (coin === "Ton") {
      fiatAmount = userDetails.tonRate * amount;
    }
    // Fetch transaction history for the receiving wallet
    const transactions = await getTransactionHistory(ReceivingWalletAddress); // Assuming getTransactionHistory is async

    // Convert amount to nanoton (smallest unit of TON)
    const expectedAmount = amount * 1e9;

    // Helper function to process and verify transactions
    function verifyTransactions(
      transactions,
      specificWalletAddress,
      expectedAmount
    ) {
      const FIVE_MINUTES_IN_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
      const currentTime = Date.now(); // Current timestamp in milliseconds
      let transferVerified = false;

      transactions.forEach((transaction) => {
        const inMsg = transaction.in_msg;

        if (
          inMsg &&
          inMsg.source === specificWalletAddress && // Check if the source matches the sender's address
          parseInt(inMsg.value, 10) === parseInt(expectedAmount, 10) && // Check if the amount matches
          transaction.utime * 1000 >= currentTime - FIVE_MINUTES_IN_MS // Check if the transaction happened in the last 5 minutes
        ) {
          console.log("✅ Transfer Verified!");
          console.log("From:", inMsg.source);
          console.log("Amount:", parseInt(inMsg.value, 10) / 1e9, "TON");
          transferVerified = true; // Mark the transfer as verified
        }
      });

      return transferVerified;
    }

    // Call the verification function
    const transferVerified = verifyTransactions(
      transactions,
      sendersAddress,
      expectedAmount
    );

    // Handle the response based on verification result
    if (transferVerified) {
      const sendingFiat = await sendFiat(
        fiatAmount,
        recipient,
        reason,
        vendorId
      );
      session.completeTransaction(); // Complete the session

      return res
        .status(200)
        .json({ message: "Transfer verified successfully." });
    } else {
      session.rollbackTransaction(); // Rollback the session
      return res.status(400).json({
        message: "Transfer verification failed. No matching transaction found.",
      });
    }
  } catch (error) {
    session.rollbackTransaction(); // Rollback the session on error
    console.error("Error verifying transfer:", error);
    return res.status(500).json({
      message: "An error occurred while verifying the transfer.",
    });
  }
};

export { cryptoWallet, sendCrypto, receivedTonVerificationAndSendFiat };
