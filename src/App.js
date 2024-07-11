import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx"
import NavBar from "./Components/common/Navbar.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OpenRoute from "./Components/core/HomePage/Auth/OpenRoute.jsx";
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import UpdatePassword from "./pages/UpdatePassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./Components/core/HomePage/Auth/PrivateRoute.jsx";
import MyProfile from "./Components/core/Dashboard/MyProfile.jsx";
import Error from "./pages/Error.jsx";
import EnrolledCourses from "./Components/core/Dashboard/EnrolledCourses.jsx";
import Cart from "./Components/core/Dashboard/Cart/index.jsx";
import { ACCOUNT_TYPE } from "./utils/constants.js";
import { useSelector } from "react-redux";

import Settings from "./Components/core/Dashboard/Settings"
function App() {

const {user} = useSelector((state)=>state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col font-inter">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="/about"
          element={
            <OpenRoute>
              <About />
            </OpenRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />




        <Route element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
         <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
         <Route path="/dashboard/cart" element={<Cart />} />
          </>
        )
      }
        </Route>



        <Route
          path="*"
          element={<Error />}
        />
      </Routes>
    </div>
  );
}

export default App;

// open route is for non logged in user
