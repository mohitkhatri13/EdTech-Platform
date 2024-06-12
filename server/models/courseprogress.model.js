const mongoose = require("mongoose")

const  courseprogressSchema = new mongoose.Schema({
     courseID:{
        type:mongoose.type.Schema.ObjectId,
        ref:"Course"
     },
     completedVideos:[{
        type:mongoose.type.Schema.ObjectId,
        ref:"subSection"
     }]

})
module.exports = mongoose.model("CourseProgress" , courseprogressSchema);