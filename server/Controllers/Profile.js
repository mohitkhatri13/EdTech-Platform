const Profile = require("../models/profilemodel");
const User = require("../models/usermodel")
const { uploadImageToCloudinary } = require("../utils/ImageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress  = require("../models/courseprogressmodel")
const Course = require("../models/coursemodel")
exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth="" , gender, about = "", contactNumber } = req.body;
    // get user id
    const id = req.user.id
    //validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required"
      })
    }

    //find profile 
    
    const userdetail = await User.findById(id);
    // console.log(userdetail);
    const profile = await Profile.findById(userdetail.additionalDetails);
      //  console.log(profile);


    //update it
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;    
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    await profile.save();
    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
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
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

      userDetails = userDetails.toObject()  // onverting the plaint mongoose document to js object making it easier too manilupate
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
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

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
