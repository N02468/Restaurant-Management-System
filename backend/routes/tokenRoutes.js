// routes/tokenRoutes.js (extend same file)
import express from "express";
import crypto from "crypto";
import Token from "../models/Token.js";

const router = express.Router();
const secret = "23334"; 

function generateToken(validityInDays = 30) {
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityInDays);
    return { token, expiresAt };
  }


router.post("/verify", async (req, res) => {
    const { token } = req.body;
    try {
      const record = await Token.findOne({ token });
      if (!record) return res.status(400).json({ valid: false, message: "Invalid token" });
  
      const now = new Date();
      if (now > record.expiresAt) {
        return res.status(400).json({ valid: false, message: "Token expired" });
      }
  
      res.json({ valid: true, message: "Token is valid" });
    } catch (err) {
      res.status(500).json({ valid: false, message: "Token verification failed" });
    }
  });
  
  router.post("/generate", async (req, res) => {
    const { days } = req.body;
    const { token, expiresAt } = generateToken(days || 30);
    try {
      const newToken = new Token({ token, expiresAt });
      await newToken.save();
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Token generation failed." });
    }
  });

export default router;
export { router as tokenRoutes };
  