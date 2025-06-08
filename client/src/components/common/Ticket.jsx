import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import dayjs from "dayjs";
import { FRONTEND_URL } from "../../configs/config";

const Ticket = ({ booking, title }) => {
  if (!booking || !booking.movie) return null;

  return (
    <Box
      sx={{
        maxWidth: 720,
        margin: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: "12px",
        boxShadow: 3,
        overflow: "hidden",
        fontFamily: "'Courier New', monospace",
        width: "100%",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          flex: 2,
          backgroundColor: "#b71c1c",
          color: "#fff8e1",
          padding: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🎬 {title}
          </Typography>
          <Stack spacing={0.5} mt={2}>
            <Typography>Mã số: {booking.id}</Typography>
            <Typography>Thời gian đặt vé: {dayjs(booking.createdAt).format("HH:mm:ss DD/MM/YYYY")}</Typography>
            <Typography>Ngày chiếu phim: {dayjs(booking.date).format("DD/MM/YYYY")}</Typography>
            <Typography>Giờ chiếu phim: {booking.hour}</Typography>
            <Typography>Vị trí ghế: {booking.seatNumber}</Typography>
          </Stack>
        </Box>

        {/* Răng cưa chỉ hiện trên màn hình md trở lên */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: 0,
            right: -20,
            height: "100%",
            width: 40,
            background:
              "repeating-linear-gradient(#fce4ec 0px, #fce4ec 10px, transparent 10px, transparent 20px)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff3e0",
          padding: 2,
          textAlign: "center",
          borderLeft: { xs: "none", md: "2px dashed #b71c1c" },
          borderTop: { xs: "2px dashed #b71c1c", md: "none" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <QRCodeCanvas
          value={`${FRONTEND_URL}/ticket/${booking.id}`}
          size={100}
          style={{ margin: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default Ticket;
