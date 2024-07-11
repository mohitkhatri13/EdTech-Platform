const express = require("express")
const router =  express.Router()

const {
   contactus
} = require("../Controllers/contactus")

router.post("/contactus" , contactus)


module.exports = router