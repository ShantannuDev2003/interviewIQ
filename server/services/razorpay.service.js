import dotenv from "dotenv";
dotenv.config();
import Razorpay from 'razorpay'

// Validate credentials at startup
console.log("Razorpay Service - Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Service - Secret length:", process.env.RAZORPAY_KEY_SECRET?.length);
if (!process.env.RAZORPAY_KEY_ID) {
  console.error("❌ Error: RAZORPAY_KEY_ID is missing in .env file");
  throw new Error("RAZORPAY_KEY_ID not configured");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Error: RAZORPAY_KEY_SECRET is missing in .env file");
  throw new Error("RAZORPAY_KEY_SECRET not configured");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})



export default razorpay;