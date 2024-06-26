import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
import {deleteBooking, getUserBooking } from "../api-helpers/api-helpers.js";
import React from 'react';
const BookingItem = ({ booking, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    await deleteBooking(booking.id)
      .then(() => {toast.success("Xóa vé thành công!");
      onRemoved(booking.id);})
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
            to={routesGen.mediaDetail(booking.movie.id)}
            style={{ color: "unset", textDecoration: "none" }}
          >
            <Box sx={{
              paddingTop: "160%",
              ...uiConfigs.style.backgroundImage(booking.movie.posterUrl)
            }} />
          </Link>
        </Box>

        <Box sx={{
          width: { xs: "100%", md: "80%" },
          padding: { xs: 0, md: "0 2rem" }
        }}>
          <Stack spacing={1}>
            <Link
              to={routesGen.mediaDetail(booking.movie.id)}
              style={{ color: "unset", textDecoration: "none" }}
            >
              <Typography
                variant="h6"
                sx={{ ...uiConfigs.style.typoLines(1, "left") }}
              >
                {booking.movie.title}
              </Typography>
            </Link>
            <Typography variant="caption">
              Mã số: {booking.id}
            </Typography>
            <Typography variant="caption">
              Thời gian đặt vé: {dayjs(booking.createdAt).format("HH:mm:ss DD/MM/YYYY")}
            </Typography>
            <Typography variant="caption">
              Ngày chiếu phim: {dayjs(booking.date).format("DD/MM/YYYY")}
            </Typography>
            <Typography variant="caption">
              Giờ chiếu phim: {booking.hour}
            </Typography>
            <Typography variant="caption">
              Vị trí ghế: {booking.seatNumber}
            </Typography>
          </Stack>
        </Box>

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
          loading={onRequest}
          onClick={handleDeleteClick}
        >
          xóa
        </LoadingButton>
      </Box>
    </div>
  );
};

const BookingList = () => {
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const skip = 8;
  
  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await getUserBooking()
        .then((res) => {
          setBookings(res.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setCount(res.bookings.length);
          setFilteredBookings(res.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, skip));
        })
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, []);

  const onLoadMore = () => {
    setFilteredBookings([...filteredBookings, ...[...bookings].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    console.log({ bookings });
    const newBookings = [...bookings].filter(e => e.id !== id);
    console.log({ newBookings });
    setBookings(newBookings);
    setFilteredBookings([...newBookings].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <div>
      {bookings && (
        <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={`vé của bạn (${count})`}>
          <Stack spacing={2}>
            {filteredBookings.map((item) => (
              <Box key={item.id}>
                <BookingItem booking={item} onRemoved={onRemoved} />
                <Divider sx={{
                  display: { xs: "block", md: "none" }
                }} />
              </Box>
            ))}
            {filteredBookings.length < bookings.length && (
              <Button onClick={onLoadMore}>xem thêm</Button>
            )}
          </Stack>
        </Container>
      </Box>
      )}
    </div>
  );
};

export default BookingList;