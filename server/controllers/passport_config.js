import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  findUserByEmail,
  validatePassword,
} from "../middleware/auth_services.js";
import userModel from "../models/userModel.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await userModel.findOne({ email });

      if (!user || !user.verified)
        return done(null, false, {
          message: "User not found or has not been verified",
        });

      const isValid = await validatePassword(password, user.password);
      if (!isValid) return done(null, false, { message: "Invalid password" });

      const filteredResponse = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
      };

      return done(null, filteredResponse);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id); // Replace with your DB lookup

  done(null, user || false);
});

export default passport;
