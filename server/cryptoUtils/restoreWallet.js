import { mnemonicToSeed } from "bip39";
import TonWeb, { HttpProvider, utils } from "tonweb";

const tonweb = new TonWeb(
  new HttpProvider("https://toncenter.com/api/v2/jsonRPC")
);

async function recoverWalletFromMnemonic(mnemonic) {
  // Derive seed from the mnemonic
  const seed = await mnemonicToSeed(mnemonic);

  // Use the first 32 bytes of the seed for key pair generation
  const keyPair = utils.keyPairFromSeed(seed.slice(0, 32));

  const publicKey = keyPair.publicKey;
  const wallet = tonweb.wallet.create({ publicKey, workchain: 0 });
  const walletAddress = await wallet.getAddress();

  console.log(
    "Recovered Wallet Address:",
    walletAddress.toString(true, true, true)
  );
}

// const mnemonic = "your saved mnemonic phrase here"; // Replace with actual phrase
export default recoverWalletFromMnemonic;
