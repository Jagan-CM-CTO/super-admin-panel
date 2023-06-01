import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "./styles.css";

// import required modules
import { Pagination, Navigation } from "swiper";
import { Image } from "@chakra-ui/react";

export default function ImageSlider({ images = [] }) {
  console.log(JSON.parse(localStorage.getItem("jwt")));
  return (
    <>
      <Swiper
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {images &&
          images?.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image?.attributes?.url}
                fallbackSrc="https://via.placeholder.com/70"
                alt="whatever"
                maxHeight="300px"
                objectFit="contain"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
