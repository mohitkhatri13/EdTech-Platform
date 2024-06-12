const mongoose = require("mongoose")

const  subsectionSchema = new mongoose.Schema({
    title:{
        type:String
    },
    timeDuration:{
        type:String
    },
    Description:{
        type:String
    },
    VideoUrl:{
        type:String,
    }
    
})
module.exports = mongoose.model("subSection" , subsectionSchema);