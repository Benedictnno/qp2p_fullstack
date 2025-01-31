import cryptoWalletModel from "../models/cryptoWalletModel.js";
import userDetailsModel from "../models/userDetailsModel.js";
import crypto from "@ton/crypto";
import ton from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
const { mnemonicToWalletKey } = crypto;
const { WalletContractV4, TonClient, fromNano, internal } = ton;
import { generateMnemonic } from "bip39";
import { encryptMnemonic, decryptMnemonic } from "../utils/storeMnemonics.js";

const createWallet = async (req, res) => {
  const {
    user: { _id },
  } = req.user;

  const mnemonic = generateMnemonic(256);
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4?.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  const address = wallet.address.toString({ testOnly: true });
  const encryptedMnemonic = encryptMnemonic(mnemonic);

  const storeWallet = await cryptoWalletModel.create({
    mnemonic: encryptedMnemonic,
    walletAddress: address,
    user: _id,
  });
  await userDetailsModel.updateOne({
    walletId: storeWallet._Id,
  });
  res.status(200).json({ storeWallet });
};

const getWallet = async (req, res) => {
  const Wallet = await cryptoWalletModel.find({});
  res.status(200).json({ Wallet });
};
const getUserTonAddress = async (req, res) => {
  const { id } = req.params;

  const Wallet = await cryptoWalletModel.findOne({ user: id });

  res.status(200).json({
    walletAddress: Wallet.walletAddress,
  });
};

const getUserTonMnemonic = async (req, res) => {

  const { _id } = req.user;

  const Wallet = await cryptoWalletModel.findOne({ user: _id });
  const mnemonic = decryptMnemonic(Wallet.mnemonic);
  res.status(200).json({
    mnemonic,
  });
};

const getWalletBalance = async (id) => {
  try {
    const userWallet = await cryptoWalletModel.findOne({
      user: id,
    });

    if (!userWallet || !userWallet.mnemonic) {
      return { error: "Wallet not found" };
    }
    
    const mnemonic = decryptMnemonic(userWallet.mnemonic);
    
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({
      publicKey: key.publicKey,
      workchain: 0,
    });
    // Get the correct endpoint
    const endpoint = await getHttpEndpoint({ network: "testnet" });

    // Initialize the client
    const client = new TonClient({ endpoint });

    // Get wallet balance
    const balance = await client.getBalance(wallet.address.toString());

    // Open the wallet contract and fetch seqno
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    await cryptoWalletModel
      .findOneAndUpdate(
        {
          user: id,
        },
        { tonBalance: fromNano(balance) }
      )
      .select("tonBalance");

    return { balance: fromNano(balance) };
  } catch (error) {
    console.error("Error:", error);
  }
};
const restoreWallet = async (req, res) => {
  const { walletId } = req.body;
  
  const restoreWallet = await wallet.findOne({ mnemonic: walletId });
  res.status(200).send(restoreWallet);
};
const verifyWallet = async (req, res) => {
  const { customersAddress, vendorWalletId, value } = req.body;

  try {
    // Validate input
    if (!customersAddress || !vendorWalletId || !value) {
      return res.status(400).json({ error: "Provide all necessary details" });
    }

    // Fetch wallet balance
    const balance = await getWalletBalance(vendorWalletId);
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // Check if the customer's wallet is deployed
    const isDeployed = await client.isContractDeployed(customersAddress);
    if (!isDeployed) {
      return res.status(400).json({
        error:
          "Your wallet has not been activated. By proceeding with the payment, you agree to pay between 0.05-0.2 TON to activate your inactive wallet.",
      });
    }
    if (value > balance) {
      return res.status(400).json({
        error: "vendor does not have enough liquidity to carry out this trade",
      });
    }

    // Log balance and respond with success
    
    return res.status(200).json({ message: "Proceed" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Inexistent wallet ID" });
  }
};

export {
  createWallet,
  getWallet,
  verifyWallet,
  restoreWallet,
  getWalletBalance,
  getUserTonAddress,
  getUserTonMnemonic,
};
