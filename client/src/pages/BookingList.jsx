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
import axios from "axios"; 
import React from 'react';
import Ticket from "../components/common/Ticket.jsx";

const BookingItem = ({ booking, onRemoved, isActive }) => {
  const [onRequest, setOnRequest] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Hàm cộng tiền vào ví user
  const refundToWallet = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.put(`/user/update-wallet/${userId}`, { amount: 10000 });
    } catch (err) {
      toast.error("Cộng tiền vào ví thất bại!");
    }
  };

  const onCancel = async () => {
    if (onRequest) return;
    setOnRequest(true);
    await deleteBooking(booking.id)
      .then(async () => {
        toast.success("Hủy vé thành công! Đã hoàn tiền vào ví.");
        await refundToWallet();
        onRemoved(booking.id);
      })
      .catch((err) => toast.error("Hủy vé thất bại!"));
    setOnRequest(false);
  };

  const handleCancelClick = () => {
    // Kiểm tra điều kiện hủy vé
    const now = dayjs();
    const showDateTime = dayjs(`${dayjs(booking.date).format("YYYY-MM-DD")}T${booking.hour}`);
    if (showDateTime.diff(now, "day") < 1) {
      toast.warn("Chỉ được hủy vé trước thời gian chiếu ít nhất 1 ngày!");
      return;
    }
    setOpenDeleteDialog(true);
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
        <DialogTitle>Xác nhận {isActive ? "hủy vé" : "xóa"}</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn {isActive ? "hủy vé" : "xóa"} không?
        </DialogContent>
        {isActive && (
          <DialogContent>
            Lưu ý: Chỉ có thể hủy vé trước thời gian chiếu phim một ngày.
          </DialogContent>)}
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <LoadingButton
            onClick={isActive ? onCancel : () => onRemoved(booking.id)}
            loading={onRequest}
            variant="contained"
          >
            {isActive ? "Hủy vé" : "Xóa"}
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
            </Link>
            <Ticket booking={booking} title={booking.movie.title}/>
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
          onClick={isActive ? handleCancelClick : handleDeleteClick}
        >
          {isActive ? "Hủy vé" : "Xóa"}
        </LoadingButton>
      </Box>
    </div>
  );
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);
  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredExpired, setFilteredExpired] = useState([]);
  const [pageActive, setPageActive] = useState(1);
  const [pageExpired, setPageExpired] = useState(1);
  const [countActive, setCountActive] = useState(0);
  const [countExpired, setCountExpired] = useState(0);
  const dispatch = useDispatch();

  const skip = 8;

  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await getUserBooking()
        .then((res) => {
          const now = dayjs();
          const sorted = res.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const active = [];
          const expired = [];
          sorted.forEach(booking => {
            // Ghép ngày và giờ chiếu thành 1 thời điểm
            const showDateTime = dayjs(`${dayjs(booking.date).format("YYYY-MM-DD")}T${booking.hour}`);
            if (showDateTime.isAfter(now)) {
              active.push(booking);
            } else {
              expired.push(booking);
            }
          });
          setBookings(sorted);
          setActiveBookings(active);
          setExpiredBookings(expired);
          setCountActive(active.length);
          setCountExpired(expired.length);
          setFilteredActive(active.slice(0, skip));
          setFilteredExpired(expired.slice(0, skip));
        })
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, []);

  const onLoadMoreActive = () => {
    setFilteredActive([...filteredActive, ...[...activeBookings].splice(pageActive * skip, skip)]);
    setPageActive(pageActive + 1);
  };

  const onLoadMoreExpired = () => {
    setFilteredExpired([...filteredExpired, ...[...expiredBookings].splice(pageExpired * skip, skip)]);
    setPageExpired(pageExpired + 1);
  };

  const onRemoved = (id) => {
    const newActive = [...activeBookings].filter(e => e.id !== id);
    const newExpired = [...expiredBookings].filter(e => e.id !== id);
    setActiveBookings(newActive);
    setExpiredBookings(newExpired);
    setFilteredActive([...newActive].splice(0, pageActive * skip));
    setFilteredExpired([...newExpired].splice(0, pageExpired * skip));
    setCountActive(newActive.length);
    setCountExpired(newExpired.length);
  };

  return (
    <div>
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={`Vé khả dụng (${countActive})`}>
          <Stack spacing={2}>
            {filteredActive.map((item) => (
              <Box key={item.id}>
                <BookingItem booking={item} onRemoved={onRemoved} isActive={true} />
                <Divider sx={{ display: { xs: "block", md: "none" } }} />
              </Box>
            ))}
            {filteredActive.length < activeBookings.length && (
              <Button onClick={onLoadMoreActive}>xem thêm</Button>
            )}
            {filteredActive.length === 0 && (
              <Typography color="text.secondary">Không có vé khả dụng.</Typography>
            )}
          </Stack>
        </Container>
        <Container header={`Vé hết hạn (${countExpired})`}>
          <Stack spacing={2}>
            {filteredExpired.map((item) => (
              <Box key={item.id}>
                <BookingItem booking={item} onRemoved={onRemoved} isActive={false} />
                <Divider sx={{ display: { xs: "block", md: "none" } }} />
              </Box>
            ))}
            {filteredExpired.length < expiredBookings.length && (
              <Button onClick={onLoadMoreExpired}>xem thêm</Button>
            )}
            {filteredExpired.length === 0 && (
              <Typography color="text.secondary">Không có vé đã hết hạn.</Typography>
            )}
          </Stack>
        </Container>
      </Box>
    </div>
  );
};

export default BookingList;