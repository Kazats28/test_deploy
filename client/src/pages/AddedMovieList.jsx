import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { routesGen } from "../routes/routes.jsx";
import { getAdminById, deleteMovie } from "../api-helpers/api-helpers.js";
import { Edit } from '@mui/icons-material';
import React from 'react';
const MovieItem = ({ movie, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    await deleteMovie(movie.id)
      .then(() => {toast.success("Xóa phim thành công!");
      onRemoved(movie.id);})
      .catch((err) => console.log(err));
    setOnRequest(false);
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };
  return (
    <div>
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <LoadingButton
            onClick={onRemove}
            loading={onRequest}
            variant="contained"
          >
            Xóa
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Box sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: 1,
        opacity: onRequest ? 0.6 : 1,
        "&:hover": { backgroundColor: "background.paper" }
      }}>
        <Box sx={{ width: { xs: 0, md: "10%" } }}>
          <Link
            to={routesGen.mediaDetail(movie.id)}
            style={{ color: "unset", textDecoration: "none" }}
          >
            <Box sx={{
              paddingTop: "160%",
              ...uiConfigs.style.backgroundImage(movie.posterUrl)
            }} />
          </Link>
        </Box>

        <Box sx={{
          width: { xs: "100%", md: "80%" },
          padding: { xs: 0, md: "0 2rem" }
        }}>
          <Stack spacing={1}>
            <Link
              to={routesGen.mediaDetail(movie.id)}
              style={{ color: "unset", textDecoration: "none" }}
            >
              <Typography
                variant="h6"
                sx={{ ...uiConfigs.style.typoLines(1, "left") }}
              >
                {movie.title}
              </Typography>
            </Link>
            <Typography variant="caption">
              Mô tả phim: {movie.description}
            </Typography>
            <Typography variant="caption">
              Ngày công chiếu: {dayjs(movie.releaseDate).format("DD/MM/YYYY")}
            </Typography>
          </Stack>
        </Box>
        <Grid width={{xs: "60%", md: "20%"}} container spacing={2}>
        <Grid item xs={6} md={12}>
        <Link to={routesGen.update(movie.id)}>
        <LoadingButton
          variant="contained"
          sx={{
            position: { xs: "relative", md: "absolute" },
            right: { xs: 0, md: "10px" },
            marginTop: { xs: 2, md: 0 },
            width: "max-content"
          }}
          startIcon={<Edit />}
        >
          sửa
        </LoadingButton></Link>
        </Grid>
        <Grid item xs={6} md={12}>
        <LoadingButton
          variant="contained"
          sx={{
            position: { xs: "relative", md: "absolute" },
            right: { xs: 0, md: "10px" },
            marginTop: { xs: 2, md: 0 },
            width: "max-content"
          }}
          startIcon={<DeleteIcon />}
          loadingPosition="start"
          onClick={handleDeleteClick}
          loading={onRequest}
        >
          xóa
        </LoadingButton>
        </Grid>
      </Grid>
      </Box>
    </div>
  );
};

const AddedMovieList = () => {
  
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const skip = 8;
  
  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await getAdminById()
        .then((res) => {
          setMovies(res.admin.addedMovies.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
          setCount(res.admin.addedMovies.length);
          setFilteredMovies(res.admin.addedMovies.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, skip));
        })
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, []);
  const onLoadMore = () => {
    setFilteredMovies([...filteredMovies, ...[...movies].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    console.log({ movies });
    const newMovies = [...movies].filter(e => e.id !== id);
    console.log({ newMovies });
    setMovies(newMovies);
    setFilteredMovies([...newMovies].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <div>
      {movies && (
        <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={`Phim đã thêm (${count})`}>
          <Stack spacing={2}>
            {filteredMovies.map((item) => (
              <Box key={item.id}>
                <MovieItem movie={item} onRemoved={onRemoved} />
                <Divider sx={{
                  display: { xs: "block", md: "none" }
                }} />
              </Box>
            ))}
            {filteredMovies.length < movies.length && (
              <Button onClick={onLoadMore}>xem thêm</Button>
            )}
          </Stack>
        </Container>
      </Box>
      )}
    </div>
  );
};

export default AddedMovieList;