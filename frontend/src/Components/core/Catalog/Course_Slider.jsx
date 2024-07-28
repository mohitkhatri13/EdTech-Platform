import React from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import Course_Card from "./Course_Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules"; 
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
// import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../style.css";

function Course_Slider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          className="mySwiper max-h-[30rem]"
          slidesPerView={1}
          spaceBetween={25}
          freeMode={true}
          loop={true}
          modules={[FreeMode, Pagination, Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            1200: {
              slidesPerView: 3,
            },
            800: {
              slidesPerView: 2,
            },
            320: {
              slidesPerView: 1,
            },
          }}
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
}

export default Course_Slider;
