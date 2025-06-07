import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import uiConfigs from "../configs/ui.configs.js";
import HeroSlide from "../components/common/HeroSlide.jsx";
import MediaGrid from "../components/common/MediaGrid.jsx";
import { setAppState } from "../redux/features/appStateSlice.js";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";
import { getAllMovies } from "../api-helpers/api-helpers.js";
import React from 'react';
const MediaList = () => {
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const skip = 12;
  
  useEffect(() => {
    const getMovies = async () => {
      window.scrollTo(0, 0);
      dispatch(setAppState("movie"));
      dispatch(setGlobalLoading(true));
      await getAllMovies()
        .then((data) => {setMovies(data.movies);
        setFilteredMovies(data.movies.slice(0, skip));})
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getMovies();
  }, []);
  const onLoadMore = () => {
    setFilteredMovies([...filteredMovies, ...[...movies].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  return (
    <>
      <HeroSlide/>
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack
          spacing={2}
          direction={{ xs: "row", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4 }}
        >
        </Stack>
        <Typography fontWeight="700" variant="h5" marginBottom={4}>
          Tất cả phim
        </Typography>
         <MediaGrid
          medias={filteredMovies}
        />
        {filteredMovies.length < movies.length && (
          <Button
            sx={{ marginTop: 8 }}
            fullWidth
            color="primary"
            onClick={onLoadMore}
          >
            xem thêm
        </Button>        
        )}
      </Box>
    </>
  );
};

export default MediaList;