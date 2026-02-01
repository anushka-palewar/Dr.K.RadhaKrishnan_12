const jwt = require("jsonwebtoken");
const Register = require("../models/Register");

exports.protect = async (req, res, next) => {
  try {
    console.log("🍪 COOKIES RECEIVED:", req.cookies);

    const token = req.cookies.token;
    if (!token) {
      console.log("❌ NO TOKEN FOUND IN COOKIES");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("🔐 RAW TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ DECODED TOKEN:", decoded);

    const user = await Register.findById(decoded.id);
    console.log("👤 USER FOUND:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND FOR ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("🔥 JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
