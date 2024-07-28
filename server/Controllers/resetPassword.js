const User = require("../models/usermodel");
const mailsender = require("../utils/mailsender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter your Email First ",
      });
    } 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Enter Valid Email ",
      });
    }
    //  console.log(user);
    //generate token
    const token = crypto.randomBytes(20).toString("hex");
    // console.log(token);
    //update the user by adding token and expiration time
    const updateddetails = await User.findOneAndUpdate(
      { email: email },  // iske base par search karo 
      {  //inko update karo 
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    console.log("DETAILS", updateddetails);
    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail to the user containg the email
    await mailsender(
      email,
      "Password Reset Link",
      `Password Reset Link ${url}`
    );
    //return response
    return res.json({
      success: true,
      message:
        "Email sent successfully  , please check email and change password ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went Wring while reset the password",
    });
  }
};


//Reset Password 
exports.resetPassword = async (req, res) => {

  try {
    const { password, confirmpassword, token } = req.body;

    //validation
    // console.log(password)
    if (password !== confirmpassword) {
      return res.json({
        success: false,
        message: "Password not matched"
      })
    }

    const userdetails = await User.findOne({ token:token });

    // if no entry 
    if (!userdetails) {
      return res.json({
        success: false,
        message: "Token is invalid"
      }) }

    if (userdetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expires please regenerate your token"
      })
    }
    const hashed = await bcrypt.hash(password, 10);
       console.log(password);
    await User.findOneAndUpdate(
      { token: token },
      { password: hashed },
      { new: true }
    );
 
    return res.status(200)
      .json({
        success: true,
        message: "Password Reset Successfully"
      })

  }

  catch (error) {
    return res.status(400)
      .json({
        success: false,
        message: "Something went Wrong"
      })
  }
}
