import { Router } from "express";
const router = Router();
import {
  login,
  refreshToken,
  logout,
  registerUser,
  verifyEmail,
} from "../controllers/authController.js";
import passport from "passport";

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.post("/refresh", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/logout", logout);
router.post("/register", registerUser);

export default router;

