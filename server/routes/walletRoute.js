import { Router } from "express";
const router = Router();
import {
  createWallet,
  restoreWallet,
  getWallet,
  verifyWallet,
  getUserTonAddress,
  getUserTonMnemonic,
} from "../controllers/wallet.js";
import {
  fundFiatWallet,
  getUserWallet,
  sendFiat,
  verifyAcct,
  transactions,
} from "../controllers/fiatWalletController.js";
import authorize from "../middleware/authorize.js";
import {resolveAcct} from "../utils/sendFundUtils.js";
import getBank from "../utils/getBanks.js";
import {
  cryptoWallet,
  receivedTonVerificationAndSendFiat,
  sendCrypto,
} from "../controllers/cryptoWalletController.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.get("/crypto/createWallet", authorize(["admin", "user"]), createWallet);
router.post("/restoreWallet", authorize(["admin", "user"]), restoreWallet);
router.post("/crypto/send", limiter, sendCrypto);
router.get("/crypto/wallet", authorize(["admin", "user"]), cryptoWallet);
router.post("/crypto/verify", verifyWallet);
router.post("/fiat/fund/verify", resolveAcct);
router.get("/fiat/banks", getBank);
router.post("/fiat/fund", fundFiatWallet);

router.post("/verifyTransactionAndSendFiat", receivedTonVerificationAndSendFiat);

router.get("/fiat/fund", authorize(["admin", "user"]), getUserWallet);

router.get("/crypto/TonAddress/:id", getUserTonAddress);
router.get("/crypto/TonMnemonic", authorize(["admin", "user"]), getUserTonMnemonic);
router.post("/fiat/send", authorize(["admin", "user"]), sendFiat);
router.get("/wallets", authorize(["admin"]), getWallet);
router.get("/transactions", authorize(["admin","user"]), transactions);


export default router;
