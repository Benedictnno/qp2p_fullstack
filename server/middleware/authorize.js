import jwt from "jsonwebtoken";
import  userModel from "../models/userModel.js";
// Middleware to check if a user has the required role
const authorize = (roles) => (req, res, next) => {
  
  
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const user = await userModel.findById(decoded.id);
    // Check if the user's role matches any of the required roles

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    req.user = user; // Pass user details to the next middleware
    next();
  });
};

export default authorize;
