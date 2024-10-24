const express = require("express");
require("dotenv").config();
const app = express();

require("dotenv").config();

// const routes = require("./routes/Course")

const PORT = process.env.PORT || 4000
//middlewares
app.use(express.json());
// const router = require("./Router/routers")


const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course")
const contactusRoute = require("./routes/Contactus")


const dbConnect = require("./config/database");
dbConnect();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary") //doubt
const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv")
//middlewares
app.use(express.json());
// app.use(cookieParser());
// app.use(cors())
// app.use(cors({
//        origin: 'http://localhost:3000/' // Replace with your frontend's URL
//      }));
app.use(cookieParser());

// Set up CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://ed-tech-platform-li17.vercel.app' // Production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(fileUpload({
       useTempFiles:true,
       tempFileDir:"/tmp" }))

     //cloudinary connect
     cloudinaryConnect();  

     //routes
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);
app.use("/api/v1" , contactusRoute);
//defaultroute
app.get("/" , (req , res)=>{
       return res.json({
              success:true,
              message:"Your server is up and running"
       })
});


app.listen( PORT,(req , res)=>{
       console.log(`App is listen at Port , ${PORT}`);
})


