import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
// ================= REGISTER =================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, } = req.body;
        // validation
        if (!name ||
            !email ||
            !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        // check existing user
        const userExists = await User.findOne({
            email,
        });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        // create user
        const user = await User.create({
            name,
            email,
            password,
        });
        // generate token
        const token = generateToken(user._id.toString());
        // store in cookie
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
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name || "User",
                email: user.email,
            },
        });
    }
    catch (error) {
        console.log("REGISTER ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
// ================= LOGIN =================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password required",
            });
            return;
        }
        // find user
        const user = await User.findOne({
            email,
        });
        // check password
        if (user &&
            (await user.matchPassword(password))) {
            // generate token
            const token = generateToken(user._id.toString());
            // set cookie
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
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }
    catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log("GET PROFILE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
// ================= LOGOUT =================
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.log("LOGOUT ERROR:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        user.name =
            name || user.name;
        await user.save();
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Server Error",
        });
    }
};
//# sourceMappingURL=auth.controller.js.map