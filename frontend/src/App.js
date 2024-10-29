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
import MyCourses from "./Components/core/Dashboard/MyCourses.jsx";
import Settings from "./Components/core/Dashboard/Settings"
import AddCourse from "./Components/core/Dashboard/AddCourse/index.js";
import EditCourse from "./Components/core/Dashboard/EditCourse/index.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import VideoDetails from "./Components/core/ViewCourse/VideoDetails.jsx";
import Instructor from "./Components/core/Dashboard/Instructor.jsx";
function App() {

  const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col font-inter">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="catalog/:catalogName" element={<Catalog />}></Route>
        <Route path="courses/:courseId" element={<CourseDetails />}></Route>
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

            <About />

          }
        />
        <Route path="/contact" element={<Contact />} />

            // these are nested routes 
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

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/add-course" element={<AddCourse />} />
                <Route path="/dashboard/my-courses" element={<MyCourses />} />
                <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
                <Route path="/dashboard/instructor" element={<Instructor />} />
              </>
            )
          }
        </Route>


        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
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
