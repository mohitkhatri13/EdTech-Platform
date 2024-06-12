const Course = require("../models/coursemodel");
const Category = require("../models/Category.model");
const User = require("../models/usermodel");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");

//create course handler
exports.createCourse = async (req, res) => {
    try {
        //  fetch data
        const { courseName, courseDescription, whatyouwilllearn, price, category } = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailimage;

        //validation
        if (!courseName, !courseDescription, !whatyouwilllearn, !price, !category) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }

        //check for instructor
        const userId = req.user.id;


        const InstructorDetail = await User.findById(userId);
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
            thumbnail: thumbnailImage.secure_url
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
        const courseDetail = await Course.find({
            _id: courseId
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate({ path: "CategoryType" })
            .populate({ path: "ratingandReview" })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        //validation
        if (!courseDetail) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with this course id ${courseId}`
            })
        }
        //return  response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully ",
            data: courseDetail
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}