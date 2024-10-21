//npm i razorpay
const { instance } = require("../config/Razorpay")
const Course = require("../models/coursemodel");
const User = require("../models/usermodel")
const mailsender = require("../utils/mailsender")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
// const coursemodel = require("../models/coursemodel");
const CourseProgress = require("../models/courseprogressmodel")
const mongoose = require("mongoose");
const crypto = require("crypto");

//order initiate
exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    // console.log(courses);
    const userId = req.user.id;
    // console.log(req.user?.id);

    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
    }

    let total_amount = 0

    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id)
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" })
            }
         
                

            const uid = new mongoose.Types.ObjectId(userId)


            if (course.studentsEnrolled.includes(uid)) {
                return res
                    .status(200)
                    .json({ success: false, message: "Student is already Enrolled" })
            }

            // Add the price of the course to the total amount
            total_amount += course.price
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    }

    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        // console.log(paymentResponse)
        res.json({
            success: true,
            data: paymentResponse,
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({ success: false, message: "Could not initiate order." })
    }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user.id;


    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all the details" })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailsender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    } catch (error) {
        console.log("error in sending mail", error)
        return res
            .status(400)
            .json({ success: false, message: "Could not send email" })
    }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for (const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )

            if (!enrolledCourse) {
                return res
                    .status(500)
                    .json({ success: false, error: "Course not found" })
            }
            console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })
            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            )

            // console.log("Enrolled student: ", enrolledStudent)
            // Send an email notification to the enrolled student
            const emailResponse = await mailsender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
    }
}
// exports.capturePayment = async (req, res) => {
//     try {
//         //get course id and user id
//         const { course_id } = req.body;
//         const userId = req.user.id;

//         //validation
//         if (!course_id) {
//             return res.json({
//                 success: false,
//                 message: "Please provide valid course Id"
//             })
//         }

//         let course;
//         try {
//             course = await Course.findById(course_id);
//             if (!course) {
//                 return res.json({
//                     success: false,
//                     message: "Could not find the course"
//                 })
//             }

//             //user already pay or buy the course or not
//             //converting user id to the object id  string ->object id
//             const uid = new mongoose.Types.ObjectId(userId);
//             if (course.studentsEnrolled.includes(uid)) {
//                 return res.status(200).json({
//                     success: false,
//                     message: "Student is already enrolled"
//                 })
//             }
//         }
//         catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 success: false,
//                 message: error.message
//             })
//         }

//         //order create
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount * 100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: {
//                 courseId: course_id,
//                 userId
//             }
//         }
//         // order creations
//         try {
//             //initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse)
//             return res.status(200).json({
//                 success: true,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount
//             })
//         }
//         catch (error) {
//             console.log(error);
//             res.json({
//                 success: false,
//                 message: "Could not initiate order"
//             })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.json({
//             success: false,
//             message: "Something went wrong"
//         })
//     }
// }

// //verify signature
// exports.verifySignature = async (req, res) => {
//     try {
//         const webhooksecret = "12345678"
//         const signature = req.headers["x-razorpay-signature"];

//         //hashed based message authentication code
//         //step-1
//         const shasum = crypto.createHmac("sha256", webhooksecret);
//         // step-2
//         shasum.update(JSON.stringify(req.body()));
//         // step-3
//         const digest = shasum.digest("hex");

//         if (signature === digest) {
//             console.log("paymeny is authorised");

//             const { courseId, userId } = req.body.payload.payment.entity.notes;

//             try {
//                 //fullfill the action
//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                     { _id: courseId },
//                     {
//                         $push: { studentsEnrolled: userId },
//                     },
//                     { new: true })
//                 if (!enrolledCourse) {
//                     return res.status(500).json({
//                         success: false,
//                         message: "Course not Found"
//                     })
//                 }
//                 console.log(enrolledCourse);
//                 //find the student and add the course list enrolled coursed in it
//                 const enrolledStudent = await User.findOneAndUpdate(
//                     { _id: userId },
//                     {
//                         $push: { courses: courseId }
//                     },
//                     { new: true }
//                 );
//                 console.log(enrolledStudent);


//                 //mail sending confirmation wala
//                 const emailresponse = await mailsender(
//                     enrolledStudent.email,
//                     "Congratulationfrom us ",
//                     "Congratulation ,you are onborded into new course ",
//                 )
//                 console.log(emailresponse);
//                 return res.status(200).json({
//                     success: false,
//                     message: "Signature verified and Course Added"
//                 })

//             }
//             catch (error) {
//                 return res.status(500).json({
//                     success: false,
//                     message: error.message
//                 })
//             }
//         }
//         else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid request "
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: "something went wrong "
//         })
//     }
// }