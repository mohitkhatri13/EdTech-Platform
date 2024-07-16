const jwt = require("jsonwebtoken");

require("dotenv").config();

// const User = require("../models/usermodel");

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");
      // console.log("token after render");
    //  console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //verify the token
    try {
      const decode =  jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decode);
      // user me payload attached kar diya yaha 
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for student only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "USer role cannot be verified",
    });
  }
};

//is instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructer only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "USer role cannot be verified",
    });
  }
};

//is Admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
