import TonWeb, { HttpProvider, utils } from "tonweb";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import crypto from "crypto";
import recoverWalletFromMnemonic from "./restoreWallet";

// Initialize TonWeb
const tonweb = new TonWeb(
  new HttpProvider("https://toncenter.com/api/v2/jsonRPC")
);


async function createWalletWithMnemonic() {
  // Generate a 12-word mnemonic phrase
  const mnemonic = generateMnemonic(128); // 128 bits for 12 words
  console.log("Mnemonic Phrase:", mnemonic);

  // Derive a seed from the mnemonic phrase
  const seed = await mnemonicToSeed(mnemonic); // Returns a Buffer

  // Use the first 32 bytes of the seed for key pair generation
  const keyPair = utils.keyPairFromSeed(seed.slice(0, 32));

  const publicKey = keyPair.publicKey;
  const privateKey = keyPair.secretKey;

  // Create a TON wallet using the public key
  const wallet = tonweb.wallet.create({ publicKey, workchain: 0 });
  const walletAddress = await wallet.getAddress();

  // console.log(
  //   "New TON Wallet Address:",
  //   walletAddress.toString(true, true, true)
  // );
  // console.log("Public Key (hex):", Buffer.from(publicKey).toString("hex"));
  // console.log("Private Key (hex):", Buffer.from(privateKey).toString("hex"));

  return {
    mnemonic,
    publicKey: Buffer.from(publicKey).toString("hex"),
    privateKey: Buffer.from(privateKey).toString("hex"),
    walletAddress: walletAddress.toString(true, true, true),
  };
  // Important: Save the mnemonic phrase in a secure location
}
// recoverWalletFromMnemonic(mnemonic);

export default createWalletWithMnemonic;
