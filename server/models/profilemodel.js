const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
     gender:{
        type:String,
        require:true
     },
     dateofbirth:{
        type:String
     },
     about:{
        type:String,
        trim:true
     },
     secondarycontactnumber:{
        type:Number,
        trim:true
     }
})
module.exports = mongoose.model("Profile" , profileSchema);