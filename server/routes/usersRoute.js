import { Router } from "express";
const router = Router();
import {
  usersDetails,
  getUserDetails,
  getUserFullDetails,
  updateUsersDetails,
} from "../controllers/users.js";
import authorize from "../middleware/authorize.js";

router.post("/details", authorize(["user", "admin"]), usersDetails);
router.put("/details", authorize(["user", "admin"]), updateUsersDetails);
router.get("/details/:id", getUserDetails);
router.get("/full-details", authorize(["user", "admin"]), getUserFullDetails);

export default router;
