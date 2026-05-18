import jwt from "jsonwebtoken";
import config from "../config/config.js";
export const protect = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not authorized",
            });
            return;
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Token failed",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map