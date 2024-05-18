import React from 'react';
import HeroSlide from '../components/common/HeroSlide.jsx';
import { Box } from '@mui/material';
import uiConfigs from "../configs/ui.configs.js";
import Container from "../components/common/Container.jsx";
import MediaSlide from "../components/common/MediaSlide.jsx";
import { getAllMovies } from "../api-helpers/api-helpers.js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";

const HomePage = () => {
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const getMovies = async () => {
      window.scrollTo(0, 0);
      dispatch(setGlobalLoading(true));
      await getAllMovies()
        .then((data) => {setMovies(data.movies);
        localStorage.setItem("movies", data.movies);
        })
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getMovies();
  }, []);
  return (
    <>
      <HeroSlide/>

      <Box marginTop="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
        <Container header="Top phim mới nhất">
          <MediaSlide movies={movies} type={1}/>
        </Container>

        <Container header="Top đánh giá">
          <MediaSlide movies={movies} type={2}/>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;