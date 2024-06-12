const User = require("../models/usermodel");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailsender = require("../utils/mailsender");
const Profile = require("../models/profilemodel")

require("dotenv").config();
//sendotp
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkuserpresent = await User.findOne({ email });
    if (checkuserpresent) {
      return res.status(400).json({
        status: false,
        message: "USer already Exist",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated", otp);

    //check uniqueness of otp
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    
    const otpPayload = { email, otp };
    // console.log(otpPayload);

    //create an entry in db for otp
    let otpbody = await OTP.create(otpPayload);
    //  return response
    return res.status(200).json({
      success: true,
      messgae: "OTP sent successfully",
      otp
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

//sign up

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not matched",
      });
    }
    //check user already exist or not
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "user is already registered",
      });
    }
    //find most recent OTP
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
     
    // console.log(recentOTP);

    //validate otp
    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } 
    
    else if (otp !== recentOTP[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Otp Not Matched",
      });
    }
    ///hashed password
    const hashedpassword = await bcrypt.hash(password, 10);

    //entry in db
    const profiledetails = await Profile.create({
      gender: null,
      dateofbirth: null,
      about: null,
      secondarycontactnumber: null,
    });
    console.log(profiledetails)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      contactNumber,
      accountType,
      additionalDetails: profiledetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    //return response
    return res.status(200).json({
      success: true,
      messgae: "User registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existinguser = await User.findOne({ email }).populate(
      "additionalDetails"
    );
    if (!existinguser) {
      return res.status(400).json({
        success: false,
        message: "user not exist , Please Sign Up ",
      });
    }
    // console.log(existinguser)

    //generate jwt token after matching password

    if (await bcrypt.compare(password, existinguser.password)) {
      const payload = {
        email: existinguser.email,
        id: existinguser._id,
        accountType: existinguser.accountType,
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      existinguser.token = token;
      existinguser.password = undefined;
      

      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged In Successfully",
        token,
        existinguser, 
      });

      // return res.status(200).json({
      //   success:true,
      //   message:"hello i m under the water"
      // })
    } 
    else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failure please try again",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, confirmnewpassword, email } = req.body();

    if (!email || !oldpassword || !newpassword || !confirmnewpassword) {
      return res.status(401).json({
        success: false,
        message: "All fields are required"
      })
    }
    //also try this 
    //     const requiredFields = [email, oldpassword, newpassword, confirmnewpassword];

    // if (requiredFields.some(field => !field)) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "All fields are required"
    //     });
    // }

    const existpass = User.password;
    if (newpassword !== confirmnewpassword) {
      return res.status(200).json({
        success: false,
        message: "new password and confirmnewpassword not matched ",
      });
    }
    const ispasswordmatched = await bcrypt.compare(oldpassword, existpass);
    if (!ispasswordmatched) {
      return res.status(200).json({
        success: false,
        message: "Enter Correct Old Password ",
      });
    }

    const hashed = await bcrypt.hash(newpassword, 10);
    const response = await User.findOneAndUpdate({ email }, { password: hashed }, { new: true })

    //if above wring try this
    // user.password = hashedPassword;
    // await user.save();

    //mail sending
    await mailsender(User.email, "Password Changed Successfully", newpassword);

    return res.status(200).json({
      success: true,
      message: "password changes Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
//changepassword
// get data
//oldpassword , new password , confirm new password
//validation

//update pwd in db
//send email - passsword updated
//return response
