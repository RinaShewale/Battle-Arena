import express from "express";
import passport from "passport";
import { registerUser, loginUser, logoutUser, getProfile, updateProfile, } from "../controllers/auth.controller.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();
/* ---------------- EMAIL AUTH ---------------- */
// REGISTER
router.post("/register", registerUser);
// LOGIN
router.post("/login", loginUser);
/* ---------------- PROFILE ---------------- */
// GET PROFILE
router.get("/profile", protect, getProfile);
/* ---------------- LOGOUT ---------------- */
// LOGOUT
router.post("/logout", logoutUser);
// UPDATE PROFILE
router.put("/profile", protect, updateProfile);
/* ---------------- GOOGLE AUTH ---------------- */
// GOOGLE LOGIN
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));
/* ---------------- GOOGLE CALLBACK ---------------- */
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "https://battle-arena-ashy.vercel.app/login",
    session: false,
}), (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect("https://battle-arena-ashy.vercel.app/login");
        }
        // GENERATE JWT
        const token = generateToken(user._id.toString());
        // SAVE COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 *
                24 *
                60 *
                60 *
                1000,
        });
        // REDIRECT FRONTEND
        return res.redirect("https://battle-arena-ashy.vercel.app/");
    }
    catch (error) {
        console.log("GOOGLE CALLBACK ERROR:", error);
        return res.redirect("https://battle-arena-ashy.vercel.app/login");
    }
});
/* ---------------- GOOGLE FAIL ---------------- */
router.get("/google/fail", (req, res) => {
    res.redirect("https://battle-arena-589s.onrender.com/login");
});
export default router;
//# sourceMappingURL=auth.routes.js.map