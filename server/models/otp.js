const mongoose = require("mongoose");
const mailsender = require("../utils/mailsender");
const emailTemplate = require("../templates/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // expires: 5 * 60,
  },
});

async function sendverificationemail(email, otp) {
  try {
    const mailresponse = await mailsender(
      email,
      "Verification email ",
      emailTemplate(otp)
    );
    console.log("Email send Successfully :", mailresponse);
  } catch (error) {
    console.log("error occured while sending mail", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  // await sendverificationemail(this.email, this.otp);
  console.log("New document saved to database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendverificationemail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
