import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authAPI";
import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import {signUp}  from "../services/operations/authAPI";
const VerifyEmail = () => {
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  });
  // console.log(signupData);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmpassword
    } = signupData;
       
    // console.log(accountType);
    // console.log(firstName);
    // console.log(lastName);
    // console.log(email);
    // console.log(password);
    // console.log(confirmPassword);
    // console.log(otp);

   

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmpassword,
        otp,
        navigate
      )
    );
  };
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-richblack-25 flex flex-col items-center justify-center bg-richblack-800">
          <div>Verify Email</div>
          <p>A verification code has been sent to you. Enter the code below</p>
          <form onSubmit={handleOnSubmit}>
          <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button type="submit">Verify Email</button>
          </form>
          <div>
            <Link to="/login">
              <p>Back to Login</p>
            </Link>
          </div>

          <button onClick={() => dispatch(sendOtp(signupData.email))}>
            Resend it
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
