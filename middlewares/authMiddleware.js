import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token found." });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  req.user = decoded;
  next();
};
