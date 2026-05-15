import jwt from "jsonwebtoken";

import config from "../config/config.js";

const generateToken = (
  id: string
): string => {
  return jwt.sign(
    { id },

    config.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;