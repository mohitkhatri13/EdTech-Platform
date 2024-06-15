import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setshowPassword] = useState(false);
  const [showconfirmPassword, setshowConfirmPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const { password, confirmpassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevdata) => ({
      ...prevdata,
      [e.target.name]: e.target.value,
    }));
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmpassword, token ));
  };
  return (
    <div>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <div>
          <h1>Choose New Password</h1>
          <p>Almost done. Enter your new password and you'r all set</p>
          <form className="text-richblack-5"  onSubmit={handleOnSubmit}>
            <label>
              <p>New Password*</p>
              <input
              className="w-full text-richblack-700 px-2"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Password"
              />
              <span onClick={() => setshowPassword((prev) => !prev)}>
                {" "}
                {showPassword ? (
                  <FaEyeSlash fontSize={24} />
                ) : (
                  <FaEye fontSize={24} />
                )}{" "}
              </span>
            </label>

            <label>
              <p>Confirm New Password</p>
              <input className="w-full text-richblack-700 px-2"
                required
                type={showconfirmPassword ? "text" : "password"}
                name="confirmpassword"
                value={confirmpassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
              />
              <span onClick={() => setshowConfirmPassword((prev) => !prev)}>
                {" "}
                {showconfirmPassword ? (
                  <FaEyeSlash fontSize={24} />
                ) : (
                  <FaEye fontSize={24} />
                )}{" "}
              </span>
            </label>

            <button type="Submit">Reset Password</button>

            <div>
              <Link to="/login">
                <p>Back to Login</p>
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
