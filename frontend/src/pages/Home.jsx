import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../Components/core/HomePage/HighlightText";
import CTAButton from "../Components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../Components/core/HomePage/CodeBlocks";
import TimelineSection from "../Components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../Components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../Components/core/HomePage/InstructorSection";
import Footer from "../Components/common/Footer";
import ExploreMore from "../Components/core/HomePage/ExploreMore";
import ReviewSlider from "../Components/common/ReviewSlider";
const Home = () => {
  return (
    <div>
      {/* Section - 1 */}
      <div className="relative mx-auto   flex flex-col w-11/12 items-center text-white justify-between ">
        <Link to={"/signup"}>
          <div className="   group flex mt-16 mx-auto p-1   rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 hover:shadow-[0px_0px_10px_0px_rgba(255,255,255,1)]  ">
            <div
              className=" w-full flex  items-center justify-center gap-2 rounded-full px-10 py-[5px]  
                             transition-all duration-200 group-hover:bg-richblack-900"
            >
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold mt-7">
          Empower your future with <HighlightText text={"Coding Skills"} />{" "}
        </div>
        <div className=" mt-5 w-[65%]  text-center text-[15px] text-richblack-300 font-bold">
          with our online coding course , you can learn at your own pace , from
          anywhere in the world and get access to a wealth of resourcces,
          including hands-on projects , quizzes and personalised feedback from
          instructor{" "}
        </div>

        <div className="flex gap-7 mt-10">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="shadow-[10px_10px_2px_0px_rgba(255,255,255,1),_-1px_-1px_20px_0px_]  mx-3 my-14 w-8/12 ">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
        {/* code section -1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={"coding potential "}></HighlightText>
                with our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you "
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet\n"href="styles.css">/head>body>\nh1<a href="/">Header</a>\n/h1>\n nav<a href="maxi">\nHello\n<body>\nThis is the real world \n </body`}
            codeColor={"text-yellow-25"}
          />
        </div>
        {/* second section  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={"Coding "}></HighlightText>
                <br></br>
                <HighlightText text={"in Seconds"}></HighlightText>
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you "
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet\n"href="styles.css">/head>body>\nh1<a href="/">Header</a>\n/h1>\n nav<a href="maxi">\nHello\n<body>\nThis is the real world\n </body`}
            codeColor={"text-yellow-25"}
          />
        </div>
        <ExploreMore />
      </div>

      {/* section - 2 */}

      <div className="bg-pure-greys-5 border  text-richblack-700 relative mt-[-100px]">
      {/* // homepage_bg is the class which we defined  */}
        <div className="homepage_bg h-[400px] "> 
          <div className="w-11/12 max-w-maxContent flex  items-center gap-5 mx-auto  justify-center ">
            <div className="  flex gap-7  text-white mt-[100px] ">
              <div className=" flex gap-7    mt-[200px]">
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex items-center gap-1">
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
                </CTAButton>

                <CTAButton active={false} linkto={"/signup"}>
                  <div>Learn More</div>
                </CTAButton>
              </div>
            </div>
          </div>
        </div>

        <div className="w-11/12  mx-auto max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="flex gap-5 mb-10 mt-[95px]">
            <div className=" text-4xl font-semibold w-[45%]">
              Get the skill you need for a
              <HighlightText text={"Job that is in demand"}> </HighlightText>
            </div>
            <div className="flex flex-col gap-10 w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>


          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section-3 */}
      <div className="w-11/12  mx-auto max-w-maxContent flex items-center flex-col justify-between gap-8 bg-richblack-900 text-white  ">
        <InstructorSection />
        <h2 className="text-center text-4xl font-semibold mt-10">
          Review from other learners
        </h2>
        {/* Review slider here */}
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Home;
