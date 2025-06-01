import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import cors from "cors";
import  authRoutes from './routes/auth.js';
// Importing environment variables
import dotenv from "dotenv";
dotenv.config();

const app = express();
import dishRoutes from "./routes/DishRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";


app.use(cors());
app.use(express.json());

app.use("/api/dishes", dishRoutes);
app.use("/api/tokens", tokenRoutes);
app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to MongoDB Atlas");
}).catch((error)=>{
    console.log("Error Connecting to MongoDB",error);
})



app.get("/", (req, res) => {
    console.log("Hello World!");
    res.send("Hello World!");
  });
  

app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:${process.env.PORT}`));





function encryptToken(data) {
  const json = JSON.stringify(data);
  const cipher = crypto.createCipher("aes-256-cbc", secret);
  let encrypted = cipher.update(json, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptToken(encryptedToken) {
  const decipher = crypto.createDecipher("aes-256-cbc", secret);
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}







