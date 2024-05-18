import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "../components/common/MediaItem.jsx";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";
import { getUserFavorite, deleteFavorite} from "../api-helpers/api-helpers.js";
import dayjs from "dayjs";
import React from 'react';
const FavoriteItem = ({ favorite, onRemoved }) => {

  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    await deleteFavorite(favorite.id)
      .then((res) => {
        toast.success("Xóa phim yêu thích thành công!");
        onRemoved(favorite.id);
      })
      .catch((err) => console.log(err));
    setOnRequest(false);
  };

  return (<>
    <MediaItem 
      id={favorite.movie.id}
      posterUrl={favorite.movie.posterUrl}
      releaseDate={dayjs(favorite.movie.releaseDate).format("DD-MM-YYYY")}
      title={favorite.movie.title}
      rate={favorite.movie.averageRating}
    />
    <LoadingButton
      fullWidth
      variant="contained"
      sx={{ marginTop: 2 }}
      startIcon={<DeleteIcon />}
      loadingPosition="start"
      loading={onRequest}
      onClick={onRemove}
    >
      xóa
    </LoadingButton>
  </>);
};

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();

  const skip = 12;

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));
      await getUserFavorite()
        .then((res) => {
          setCount(res.favorites.length);
          setFavorites([...res.favorites]);
          setFilteredFavorites([...res.favorites].splice(0, skip));
        })
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };

    getFavorites();
  }, []);

  const onLoadMore = () => {
    setFilteredFavorites([...filteredFavorites, ...[...favorites].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newFavorites = [...favorites].filter(e => e.id !== id);
    setFavorites(newFavorites);
    setFilteredFavorites([...newFavorites].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Phim yêu thích của bạn (${count})`}>
        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
          {filteredFavorites.map((favorite, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <FavoriteItem favorite={favorite} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filteredFavorites.length < favorites.length && (
          <Button onClick={onLoadMore}>xem thêm</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList;