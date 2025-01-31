import TonWeb, { HttpProvider } from "tonweb";
import cryptoWalletModel from "../models/cryptoWalletModel";

// Initialize TonWeb with a provider endpoint
const tonweb = new TonWeb(
  new HttpProvider("https://toncenter.com/api/v2/jsonRPC")
);

// Your wallet address (in base64 format)
const walletAddress = "kQAlWJD7q45NTtjxaqPw4MFUkPdldHWLN8OGHfBNVN8XzYfU"; 
// Replace with your wallet address

// Function to get wallet balance
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
    console.log("Seqno:", seqno);

    const updateTonBalance = await cryptoWalletModel.findOneAndUpdate(
        {
          user: id,
        },
        { tonBalance: fromNano(balance) }
      )
      .select("tonBalance");

    console.log(updateTonBalance);

    return { balance: fromNano(balance) };
  } catch (error) {
    console.error("Error:", error);
  }
};


// Call the function to get the wallet balance
export default getWalletBalance;
