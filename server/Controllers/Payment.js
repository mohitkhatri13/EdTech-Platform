//npm i razorpay
const { instance } = require("../config/Razorpay")
const Course = require("../models/coursemodel");
const User = require("../models/usermodel")
const mailsender = require("../utils/mailsender")

const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const coursemodel = require("../models/coursemodel");

//capture the payment and initiate the razorpay order

exports.capturePayment = async (req, res) => {
    try {
        //get course id and user id
        const { course_id } = req.body;
        const userId = req.user.id;

        //validation
        if (!course_id) {
            return res.json({
                success: false,
                message: "Please provide valid course Id"
            })
        }

        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.json({
                    success: false,
                    message: "Could not find the course"
                })
            }

            //user already pay or buy the course or not 
            //converting user id to the object id  string ->object id
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }

        //order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId
            }
        }
        // order creations
        try {
            //initiate the payment using razorpay 
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse)
            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            })
        }
        catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: "Could not initiate order"
            })
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong"
        })
    }
}

//verify signature
exports.verifySignature = async (req, res) => {
    try {
        const webhooksecret = "12345678"
        const signature = req.headers["x-razorpay-signature"];

        //hashed based message authentication code
        //step-1
        const shasum = crypto.createHmac("sha256", webhooksecret);
        // step-2
        shasum.update(JSON.stringify(req.body()));
        // step-3
        const digest = shasum.digest("hex");

        if (signature === digest) {
            console.log("paymeny is authorised");

            const { courseId, userId } = req.body.payload.payment.entity.notes;

            try {
                //fullfill the action
                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    {
                        $push: { studentsEnrolled: userId },
                    },
                    { new: true })
                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        message: "Course not Found"
                    })
                }
                console.log(enrolledCourse);
                //find the student and add the course list enrolled coursed in it 
                const enrolledStudent = await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $push: { courses: courseId }
                    },
                    { new: true }
                );
                console.log(enrolledStudent);


                //mail sending confirmation wala
                const emailresponse = await mailsender(
                    enrolledStudent.email,
                    "Congratulationfrom us ",
                    "Congratulation ,you are onborded into new course ",
                )
                console.log(emailresponse);
                return res.status(200).json({
                    success: false,
                    message: "Signature verified and Course Added"
                })

            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid request "
            })
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "something went wrong "
        })
    }
}