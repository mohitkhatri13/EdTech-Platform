const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true
  },
  courseDescription: {
    type: String,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User"
  },
  whatyouwilllearn: {
    type: String
  },
  courseContent:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    }
  ],
  ratingandReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview"
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String
  },
  CategoryType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  studentsEnrolled:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true
    }]
})
module.exports = mongoose.model("Course", courseSchema);