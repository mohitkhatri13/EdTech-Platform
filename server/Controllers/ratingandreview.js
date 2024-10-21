const RatingAndReview = require("../models/ratingandreview");
const Course = require("../models/coursemodel");
const mongoose  = require("mongoose");

// createRating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        // fetched data from req body
        const { rating, review, courseId } = req.body;
        // check user is enrolled in course or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } },  // to ensure that the user
                //  is actually enrolled. tha we use eleMatch 
            }
        );
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course"
            })
        }
        // check user is already review or not
        const alreadyreviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });
        if (alreadyreviewed) {
            return res.status(404).json({
                success: false,
                message: "Course is already reviewed by user"
            })
        }
        //create review and rating
        const ratingreview = await RatingAndReview.create({
            rating,
            review,
            user: userId,
            course: courseId,
        })

        //update course with this rating/review
        const CourseUpdatedCourseDetail = await Course.findByIdAndUpdate({ _id: courseId },

            {
                $push: {
                    ratingAndReviews: ratingreview._id
                }
            },
            { new: true }
        )
        await courseDetails.save();

        // console.log(CourseUpdatedCourseDetail);
        // return Response.
        return res.status(200).json({
            success: true,
            message: "Rating and review Successfully",
            ratingreview
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get-Aavg rating

exports.getAverageRating = async (req, res) => {
    try {
        //get course ID
        const courseId = req.body.courseId;
        // calculate avg rating 
        const result = await RatingAndReview.aggregate([
            {   //these are operators 
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    // this is how we calculate avg rating
                    averageRating: { $avg: "$rating" },
                }
            }
        ])

        // return rating 
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        //if no rating reiview exist
        return res.status(200).json({
            success: true,
            message: "Average rating is 0 , no ratings given till now",
            averageRating: 0
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// get-All Rating
exports.getAllRatingReview = async (req, res) => {
    try {
        const allreviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName"
            })
            .exec()
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allreviews
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

 


