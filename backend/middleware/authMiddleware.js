import { authenticateClerkToken } from "../config/clerk.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    const userId = await authenticateClerkToken(token);
    req.auth = { userId };
    req.userId = userId;
    next();
  } catch (error) {
    res.status(error.status || 401).json({ message: error.message });
  }
}
