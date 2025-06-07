import { Box, Button, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { setGlobalLoading } from "../../redux/features/globalLoadingSlice.js";
import { routesGen } from "../../routes/routes.jsx";

import uiConfigs from "../../configs/ui.configs.js";
import CircularRate from "./CircularRate.jsx";
import {getAllMovies} from "../../api-helpers/api-helpers.js";
import React from 'react';
const HeroSlide = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await getAllMovies()
        .then((data) => setMovies(data.movies.sort((a, b) => b.bookings.length - a.bookings.length).slice(0, 4)))
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, []);

  return (
    <Box sx={{
      position: "relative",
      color: "primary.contrastText",
      "&::before": {
        content: '""',
        width: "100%",
        height: "30%",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 2,
        pointerEvents: "none",
        ...uiConfigs.style.gradientBgImage[theme.palette.mode]
      }
    }}>
      <Swiper
        grabCursor={true}
        loop={true}
        modules={[Autoplay]}
        style={{ width: "100%", height: "max-content" }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false
      }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <Box sx={{
              paddingTop: {
                xs: "130%",
                sm: "80%",
                md: "60%",
                lg: "45%"
              },
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundImage: `url(${movie.backgroundUrl})`
            }} />
            <Box sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              ...uiConfigs.style.horizontalGradientBgImage[theme.palette.mode]
            }} />
            <Box sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              paddingX: { sm: "10px", md: "5rem", lg: "10rem" }
            }}>
              <Box sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                paddingX: "30px",
                color: "text.primary",
                width: { sm: "unset", md: "30%", lg: "40%" }
              }}>
                <Stack spacing={4} direction="column">
                  {/* title */}
                  <Typography
                    variant="h4"
                    fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                    fontWeight="700"
                    sx={{
                      ...uiConfigs.style.typoLines(2, "left")
                    }}
                  >
                    {movie.title}
                  </Typography>
                  {/* title */}

                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* rating */}
                    <CircularRate value={movie.averageRating} />
                    {/* rating */}

                    <Divider orientation="vertical" />
                    {/* genres */}
                    {[...movie.genres].map((genre) => (
                      <Chip
                        variant="filled"
                        color="primary"
                        key={index}
                        label={genre}
                      />
                    ))}
                    {/* genres */}
                  </Stack>

                  {/* overview */}
                  <Typography variant="body1" sx={{
                    ...uiConfigs.style.typoLines(3)
                  }}>
                    {movie.description}
                  </Typography>
                  {/* overview */}

                  {/* buttons */}
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to={routesGen.mediaDetail(movie.id)}
                    sx={{ width: "max-content" }}
                  >
                    chi tiết
                  </Button>
                  {/* buttons */}
                </Stack>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSlide;