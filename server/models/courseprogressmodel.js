const mongoose = require("mongoose")

const  courseprogressSchema = new mongoose.Schema({
     courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
     },
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
     completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subSection"
     }]

})
module.exports = mongoose.model("CourseProgress" , courseprogressSchema);