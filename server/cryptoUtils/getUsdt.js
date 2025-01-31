import { utils } from "tonweb";
const BN = utils.BN;
import crypto from "crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import { JettonMaster, TonClient, getHttpEndpoint, JettonWallet } from "@ton/ton";
import { TonClient, getHttpEndpoint, WalletContractV4 } from "@ton/ton";
import { mnemonicToWalletKey } from "ton-crypto";

// const getJettonWalletAddress = async (
//   walletAddress = "kQA6yUjMz7lAKEUCQccV4QjGVq16vfEdQEcinTIKfWJRyVk_",
//   jettonMasterAddress
// ) => {
//   const endpoint = await getHttpEndpoint({ network: "mainnet" });
//   const client = new TonClient({ endpoint });
//   const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));

//   const jettonWalletAddress = await jettonMaster.getWalletAddress(
//     walletAddress
//   );
//   console.log("Jetton Wallet Address:", jettonWalletAddress.toString());
//   return jettonWalletAddress;
// };



const jettonMasterAddress =
  "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"; // Replace with USDT Jetton Master Address

const getUSDTBalance = async () => {
  // Replace with your wallet mnemonic
  const mnemonic = "your 24-word mnemonic phrase goes here";

  // Replace with the USDT Jetton Master Address
  const jettonMasterAddress = "EQDx..."; // Jetton Master Address for USDT on TON

  // Generate wallet keys and address
  const { mnemonicToWalletKey } = require("ton-crypto");
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const senderWallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  // Connect to TON blockchain
  const endpoint = await getHttpEndpoint({ network: "testnet" }); // Change to 'mainnet' for production
  const client = new TonClient({ endpoint });

  // Get Jetton Wallet Address
  const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));
  const jettonWalletAddress = await jettonMaster.getWalletAddress(
    senderWallet.address
  );

  console.log("Jetton Wallet Address:", jettonWalletAddress.toString());

  // Open Jetton Wallet Contract
  const jettonWallet = client.open(JettonWallet.create(jettonWalletAddress));

  // Fetch balance
  const balance = await jettonWallet.getBalance();

  console.log(`USDT Balance: ${balance} (in smallest units)`);
  console.log(`USDT Balance: ${balance / 10 ** 6} (human-readable)`); // Adjust decimals based on token
};

getUSDTBalance().catch(console.error);


