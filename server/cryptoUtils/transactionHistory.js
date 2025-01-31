import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // To load environment variables

const API_URL = "https://testnet.toncenter.com/api/v2/jsonRPC";
// const API_KEY = '77db24c3c07c68eee85410153ee17d1b047595f0d3f1cfcf1f2c33032f1a17fa'; // Store the API key in an environment variable
const API_KEY = process.env.TON_SECRET; // Store the API key in an environment variable
// UQCPI3E5L8xqvW4it2_xbPIHgWmtgwATcpA30624MPYYNf12
/**
 * Fetch transaction history for a TON wallet address.
 * @param {string} walletAddress - Wallet address in friendly format.
 */
export async function getTransactionHistory(walletAddress) {
 const getTransactions = await axios.get(
   `https://toncenter.com/api/v2/getTransactions?address=${walletAddress}&limit=10&to_lt=0&archival=true&api_key=${API_KEY}`
 );
//  console.log(getTransactions.data.result);
//  console.log('====================================');
//  console.log(getTransactions.data.result.map((msg)=>console.log(msg.out_msgs)));
//  console.log('====================================');

 return getTransactions.data.result
}

// Example usage
// const walletAddress = "UQABsgi0sLTSX7xkmOsCmsxQnWA_PaxMibkSLzs5YuF_B7ej"; // Testnet wallet address
// getTransactionHistory(walletAddress);
