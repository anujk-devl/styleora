import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token =
    req.cookies?.styleora_token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Auth required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
