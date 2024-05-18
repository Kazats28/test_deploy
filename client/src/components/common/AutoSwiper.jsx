import { Box } from "@mui/material";
import { Swiper } from "swiper/react";
import SwiperCore, { Navigation } from 'swiper';
import React from 'react';
SwiperCore.use([Navigation]);

const AutoSwiper = ({ children }) => {
  const showNavigationButtons = () => {
    const prevButton = document.querySelector('.swiper-button-prev');
    const nextButton = document.querySelector('.swiper-button-next');

    prevButton.style.opacity = '0.5';
    nextButton.style.opacity = '0.5';
  }

  const hideNavigationButtons = () => {
    const prevButton = document.querySelector('.swiper-button-prev');
    const nextButton = document.querySelector('.swiper-button-next');

    prevButton.style.opacity = '0';
    nextButton.style.opacity = '0';
  }

  return (
    <Box
      sx={{
        position: "relative",
        "& .swiper-slide": {
          width: {
            xs: "50%",
            sm: "35%",
            md: "25%",
            lg: "20.5%"
          }
        },
        "& .swiper-button-prev, & .swiper-button-next": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          cursor: "pointer",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
          padding: "0.5rem",
          border: "none",
          opacity: 0,
          transition: "opacity 0.3s ease-in-out"
        },
        "& .swiper-button-prev": {
          left: "0px",
        },
        "& .swiper-button-next": {
          right: "0px",
        },
        "&:hover .swiper-button-prev, &:hover .swiper-button-next": {
          opacity: 0.5
        }
      }}
      onMouseEnter={showNavigationButtons}
      onMouseLeave={hideNavigationButtons}
    >
      <Swiper
        slidesPerView="auto"
        grabCursor={true}
        navigation={true}
        style={{ width: "100%", height: "max-content" }}
      >
        {children}
      </Swiper>
    </Box>
  );
};

export default AutoSwiper;
