const Profile = require("../models/profilemodel");
const User = require("../models/usermodel")
const Course = require("../models/coursemodel")
const { uploadImageToCloudinary } = require("../utils/ImageUploader")

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateofbirth = "", gender, about = "", secondarycontactnumber = "" } = req.body;
    // get user id
    const id = req.user.id
    //validation
    if (!secondarycontactnumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required"
      })
    }

    //find profile 
    const userdetail = await User.findById(id);
    const profileid = await userdetail.additionalDetails;

    const profileDetails = await Profile.findById(profileid);

    //update it
    profileDetails.dateofbirth = dateofbirth;
    profileDetails.gender = gender,
    profileDetails.about = about,
    profileDetails.secondarycontactnumber = secondarycontactnumber

    await profileDetails.save()
    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
//delete account 

exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validation
    console.log(id);
    const user = await User.findById(id)
    // console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    //delete user profile
    await Profile.findByIdAndDelete({ _id: user.additionalDetails })


    //TODO _ HOMEWORK also delete or unenroll user from all enrolled courses
    //also think how to scheduled this task 
    // what is the cron job 
    // delete user
    await User.findByIdAndDelete({ _id: id });
    console.log("hello");
    //return response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted",
      error: error.message
    })
  }
}
//get all details of user

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id

    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    //return response 
    return res.status(200).json({
      success: true,
      userDetails,
      message: "user data fetche successfully"
    })


  }
  catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}


exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};