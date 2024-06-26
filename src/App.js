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
function App() {
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
          path="about"
          element={
            <OpenRoute>
              <About/>
            </OpenRoute>
          }
        />

      </Routes>
    </div>
  );
}

export default App;

// open route is for non logged in user
