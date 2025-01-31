import TonWeb, { HttpProvider, utils } from "tonweb";

// Initialize TonWeb with a provider endpoint
const tonweb = new TonWeb(
  new HttpProvider("https://toncenter.com/api/v2/jsonRPC")
);

// Your wallet public key and private key (ensure to replace these with your own keys)
const publicKeyHex = "YOUR_PUBLIC_KEY_HEX"; // Your public key in hex format
const privateKeyHex =
  "7b894652398ea4a35705919956f98710823f25a7cd6c275c528d2004f208118ea3ac5d28cada7a6cfcdc057c063bde0269b02d8b8e0855637021a5b7b732a286"; // Your private key in hex format

// Function to send TON (not USDT) - update if your integration handles wrapped tokens
async function sendTon(recipientAddress, amount) {
  try {
    // Convert private and public keys from hex to Buffer
    const privateKey = Buffer.from(privateKeyHex, "hex");
    const publicKey = Buffer.from(publicKeyHex, "hex");

    // Create a wallet instance
    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
      publicKey: publicKey,
      wc: 0,
    });

    // Get the wallet address and ensure it’s deployed
    const walletAddress = await wallet.getAddress();
    console.log(
      "Your wallet address:",
      walletAddress.toString(true, true, true)
    );

    // Check if the wallet is initialized (deployed) before sending
    const walletInfo = await tonweb.provider.getAddressInfo(
      walletAddress.toString(true, true, true)
    );
    if (walletInfo.state === "uninitialized") {
      console.log("Wallet is not initialized. Ensure it is deployed first.");
      return;
    }

    // Create a transfer transaction
    const transfer = wallet.methods.transfer({
      secretKey: privateKey,
      toAddress: recipientAddress,
      amount: utils.toNano(amount), // Amount in nanoTONs (1 TON = 1e9 nanoTONs)
      seqno: await wallet.methods.seqno().call(),
      sendMode: 3,
    });

    // Send the transfer transaction
    const response = await transfer.send();
    console.log("Transaction response:", response);
  } catch (error) {
    console.error("Error sending TON:", error);
  }
}

// Example usage: send 1 TON to a recipient address
const recipientAddress = "EQBtcA0t1dHC2P_vGj_Sg5fSJWVowVv7VUIXJzp0xCsxT6oZ"; // Replace with the recipient's address
sendTon(recipientAddress, 1); // Sending 1 TON
