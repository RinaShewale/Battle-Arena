import express from "express";
import passport from "passport";

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/auth.controller.js";

import generateToken from "../utils/generateToken.js";

const router = express.Router();

/* ---------------- EMAIL AUTH ---------------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ---------------- PROFILE ---------------- */
router.get("/profile", getProfile);

/* ---------------- LOGOUT ---------------- */
router.post("/logout", logoutUser);

/* ---------------- GOOGLE AUTH ---------------- */

// Step 1: Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/fail",
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Google Auth Failed",
      });
    }

    const token = generateToken(user._id.toString());

    // cookie set
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // TEMP TEST RESPONSE (no frontend needed)
    return res.json({
      success: true,
      message: "Google login successful 🎉",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
);

/* ---------------- FAIL ROUTE ---------------- */
router.get("/google/fail", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google Authentication Failed",
  });
});

export default router;