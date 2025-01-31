import dotenv from "dotenv";
dotenv.config(); // require("express-async-errors");
// express
import fs from 'fs'
import express, { json } from "express";
const app = express();
// rest of the packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./db/connectDB.js";
import Wallet from "./routes/walletRoute.js"; // Fix typo here
import Auth from "./routes/authroute.js"; // Fix typo here
import user from "./routes/usersRoute.js"; // Fix typo here
import passport_config from "./controllers/passport_config.js";
import path from "path";
import { fileURLToPath } from "url";

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Allow cookies
  })
);
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("dev"));

app.use(json());
app.use(cookieParser());
app.use(passport_config.initialize());

app.use("/api/v1", Wallet); // Correct route
app.use("/api/v1/auth", Auth); // Correct route
app.use("/api/v1/user", user); // Correct route

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

app.use(express.static(path.join(__dirName, "qp2p_frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirName, "qp2p_frontend/dist/index.html"))
);
const port = process.env.PORT || 5000;


const distPath = path.join(__dirName, 'qp2p_frontend/dist');
console.log('Checking if dist folder exists:', fs.existsSync(distPath));

// console.log( __fileName);
// console.log( __dirName);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
