import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const { password, confirmpassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmpassword, token,navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {loading ? (
        <div className="text-white">Loading ...</div>
      ) : (
        <div className="bg-gray-800 text-black p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Choose New Password</h1>
          <p className="text-gray-400 mb-6">
            Almost done. Enter your new password and you're all set.
          </p>
          <form className="space-y-4" onSubmit={handleOnSubmit}>
            <label className="block">
              <p className="text-sm mb-1">New Password*</p>
              <div className="relative">
                <input
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </label>

            <label className="block">
              <p className="text-sm mb-1">Confirm New Password*</p>
              <div className="relative">
                <input
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={confirmpassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-md transition-all duration-200"
            >
              Reset Password
            </button>

            <div className="mt-4">
              <Link
                to="/login"
                className="text-yellow-500 hover:underline hover:text-yellow-400"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
