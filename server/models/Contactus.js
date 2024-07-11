const mongoose = require("mongoose")
const contactusSchema = new mongoose.Schema({
  firstname:{
    type:String,
  },
  lastname:{
    type:"String"
  },
  contactno:{
    type:Number
  },
  email:{
    type:String
  },
  message:{
    type:String
  }


}) 
module.exports = mongoose.model("Contact" , contactusSchema)