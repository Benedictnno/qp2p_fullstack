const crypto = require("@ton/crypto");
const ton = require("@ton/ton");
const { getHttpEndpoint } = require("@orbs-network/ton-access");
const { mnemonicToWalletKey } = crypto;
const bip39 = require("bip39");
const TonWeb = require("tonweb");
const { JettonMaster, JettonWallet } = require("@ton/ton");
const { WalletContractV4, TonClient, fromNano, internal } = require("@ton/ton");
const { Address } = require("@ton/core");

// const tonweb = new TonWeb();
const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: "014f0277c99c3aa09a6b5bf2f3b8b6d494ecd3ea589e610ca0341bbbc6ca08d4", // Optional: Use your TON API key
  })
);
async function main() {
  // const mnemonic =
  //   "ocean breeze travel lemon crisp void feature clutch rose victory erupt lamp sibling drill glove media token tumble confirm adjust velvet regular pumpkin shield";
  const mnemonic = bip39.generateMnemonic(256);
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  console.log(wallet.address.toString({ testOnly: true }));
  console.log("workchain", wallet.address.workChain);
}

async function walletState() {
  try {
    const mnemonic =
      "ocean breeze travel lemon crisp void feature clutch rose victory erupt lamp sibling drill glove media token tumble confirm adjust velvet regular pumpkin shield";
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
    console.log("Balance:", fromNano(balance));

    // Open the wallet contract and fetch seqno
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    console.log("Seqno:", seqno);
  } catch (error) {
    console.error("Error:", error);
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function send() {
  const mnemonic =
    "ocean breeze travel lemon crisp void feature clutch rose victory erupt lamp sibling drill glove media token tumble confirm adjust velvet regular pumpkin shield";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  // Get the correct endpoint
  const endpoint = await getHttpEndpoint({ network: "testnet" });

  // Initialize the client
  const client = new TonClient({ endpoint });

  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log("wallet is not deployed");
  }
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "kQA6yUjMz7lAKEUCQccV4QjGVq16vfEdQEcinTIKfWJRyVk_",
        value: "0.05",
        body: "hello",
        bounce: false,
      }),
    ],
  });

  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transfer");

    sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed");
}

const address = "kQA6yUjMz7lAKEUCQccV4QjGVq16vfEdQEcinTIKfWJRyVk_";

async function monitorTransfers() {
  try {
    const transactions = await tonweb.provider.getTransactions(address);
    console.log("Transactions response:", transactions);

    if (Array.isArray(transactions) && transactions.length > 0) {
      transactions.forEach((tx) => {
        console.log(`Received transaction: ${JSON.stringify(tx)}`);
      });
    } else if (transactions) {
      console.log("Unexpected transactions format:", transactions);
    } else {
      console.log("No transactions found.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}

const getUSDTBalance = async () => {
  try {
    const mnemonic =
      "artefact trophy credit vacuum hint design basket topic buzz ocean mad comfort silver sausage friend nice coast fragile early valid rare taste enjoy wait";

    const jettonMasterAddress =
      "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const senderWallet = WalletContractV4.create({
      publicKey: key.publicKey,
      workchain: 0,
    });

    console.log("Sender Wallet Address:", senderWallet.address.toString());

    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });

    // Normalize Jetton Master Address
    const normalizedMasterAddress = Address.parseFriendly(jettonMasterAddress).address;
    console.log("Normalized Jetton Master Address:", normalizedMasterAddress.toString());

    const jettonMaster = client.open(JettonMaster.create(normalizedMasterAddress));
    const jettonWalletAddress = await jettonMaster.getWalletAddress(senderWallet.address);

    console.log("Derived Jetton Wallet Address:", jettonWalletAddress.toString());

    // Check if Jetton Wallet Address Exists
    const state = await client.getContractState(jettonWalletAddress);
    if (!state || !state.isDeployed) {
      throw new Error("Jetton Wallet is not deployed or initialized for this wallet.");
    }

    const jettonWallet = client.open(JettonWallet.create(jettonWalletAddress));
    const balance = await jettonWallet.getBalance();

    console.log(`USDT Balance (in smallest units): ${balance}`);
    console.log(`USDT Balance (human-readable): ${balance / 10 ** 6} USDT`);
  } catch (error) {
    console.error("Error fetching USDT balance:", error.message || error);
  }
};

getUSDTBalance();


// setInterval(() => {
//     monitorTransfers().catch(err => console.error(err));
// }, 3000); // Check every 30 seconds
// main();
// send()
// walletState();
