const Course = require("../models/coursemodel");
const Category = require("../models/Category.model");
const User = require("../models/usermodel");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
const Section = require("../models/section")
const SubSection = require("../models/subsection.model")

const CourseProgress = require("../models/courseprogressmodel")
const { convertSecondsToDuration } = require("../utils/secToDuration")
//create course handler
exports.createCourse = async (req, res) => {
  try {
    //check for instructor
    const userId = req.user.id;
    //  fetch data
    console.log(userId);
    const { courseName, courseDescription, whatyouwilllearn, price, category, tag: _tag, status,
      instructions: _instructions, } = req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailimage;

    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)
    //validation

    // console.log(courseName);
    // console.log(courseDescription);
    // console.log(whatyouwilllearn);
    // console.log(price);
    // console.log(category);
    // console.log(tag.length);
    // console.log(status);
    // console.log(instructions.length);
    // console.log(thumbnail);

    if (!courseName ||
      !courseDescription ||
      !whatyouwilllearn ||
      !price ||
      !category ||
      !tag.length ||
      !thumbnail ||
      !instructions.length) {
      return res.json({
        success: false,
        message: "All fields are required"
      })
    }



    const InstructorDetail = await User.findById(userId, {
      accountType: "Instructor",
    });
    // console.log("InstructorDetails", InstructorDetail)

    if (!InstructorDetail) {
      res.status(404).json({
        success: false,
        message: "Instructor Details are Not Found"
      })
    }

    //check given Category is valid or not
    //category is here because in user model category is passing as object id in it

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      res.status(404).json({
        success: false,
        message: "Categories details are not found"
      })
    }
    // console.log(categoryDetails)
    //upload on cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
    console.log(thumbnailImage)
    //create an entry for new course in database
    const newCourse = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      instructor: InstructorDetail._id,
      whatyouwilllearn: whatyouwilllearn,
      price: price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
      tag
    })
    // add the new course to the user schema of instructor directly because instructor not need to buy it 
    console.log(newCourse)

    await User.findByIdAndUpdate(
      { _id: InstructorDetail._id },
      {
        $push: {
          courses: newCourse._id
        }
      },
      { user: true })


    //update the Category schema  -Homework
    await Category.findByIdAndUpdate(
      { _id: category },   //konsi category me hai usko find kara id se
      {
        $push: {
          course: newCourse._id    // id push kardi 
        }
      },
      { new: true }   // for updated data
    )

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created Successfully",
      data: newCourse
    })
  }

  catch (error) {
    return res.status(401).
      json({
        success: false,
        message: "Failed to create Course",
        error: error.message
      })
  }
}


// getallcourses handler function

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingandReview: true,
        studentsEnrolled: true
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched Successfully",
      data: allCourses
    })
  }
  catch (error) {
    return res.status(401).
      json({
        success: false,
        message: "Cannot fetch Course Data",
        error: error.message
      })
  }
}
//get all course
exports.getCourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;
    // find course detail
    const courseDetails = await Course.findOne({
      _id: courseId
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails"
        }
      })
      .populate({ path: "category" })
      .populate({ path: "ratingAndReviews" })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl"
        }
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with this course id ${courseId}`
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    //return  response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully ",
      data: {
        courseDetails,
        totalDuration,
      }
    })
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}


exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
     console.log(course);

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}