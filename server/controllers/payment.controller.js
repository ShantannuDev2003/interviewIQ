import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto"

export const createOrder = async (req,res) => {
    try {
        const {planId, amount, credits} = req.body;
        
        // Validate credits
        if (credits === undefined || credits === null || credits <= 0) {
          return res.status(400).json({ message: "Invalid credits" });
        }

        // Handle free plan - no Razorpay needed
        if (amount === 0) {
          const user = await User.findByIdAndUpdate(req.userId, 
            { $inc: { credits: credits } }, 
            { new: true }
          );
          return res.json({ success: true, user, id: `free_${Date.now()}` });
        }

        // Validate paid plan
        if (!planId || amount <= 0) {
          return res.status(400).json({ message: "Invalid plan or amount" });
        }

        const options = {
          amount: amount * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log(order)

        await Payment.create({
          userId: req.userId,
          planId,
          amount,
          credits,
          razorpayOrderId: order.id,
          status: "created",
        });

        return res.json(order);
    } catch (error) {
        // Handle Razorpay auth errors
        if (error.statusCode === 401 || error.error?.code === "BAD_REQUEST_ERROR") {
          return res.status(500).json({message: "Razorpay authentication failed. Please verify API credentials in .env"});
        }
        
        const errorMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
        return res.status(500).json({message: `failed to create order: ${errorMsg}`});
    }
}


export const verifyPayment = async (req,res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ message: "Missing payment details" });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
          return res.status(500).json({ message: "Payment configuration error" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(body)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ message: "Invalid payment signature" });
        }

        const payment = await Payment.findOne({
          razorpayOrderId: razorpay_order_id,
        });

        if (!payment) {
          return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status === "paid") {
          const user = await User.findById(payment.userId);
          return res.json({ message: "Already processed", user });
        }

        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;
        await payment.save();

        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
          $inc: { credits: payment.credits }
        }, {new: true});

        res.json({
          success: true,
          message: "Payment verified and credits added",
          user: updatedUser,
        });
    } catch (error) {
        const errorMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
        return res.status(500).json({message: `failed to verify payment: ${errorMsg}`});
    }
}