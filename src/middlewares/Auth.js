import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User authenticated successfully:", req.user);
    console.log("➡️  Authentication middleware was hit");
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid or expired token");
  }
};
