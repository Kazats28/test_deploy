import { Box, Typography, Rating } from "@mui/material";
import React from 'react';
const CircularRate = ({ value }) => {
  return (
    <Box sx={{
      position: "relative",
      display: "inline-block",
      width: "max-content",
    }}>
      <Rating
        name="rating"
        value={(value / 10)}
        precision={0.1}
        min={0}
        max={1}
        size="large"
        fontSize="large"
        />
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Typography
          variant="caption"
          component="div"
          fontWeight="700"
          sx={{ marginTop: "-5px" }}
        >
          {Math.floor(value * 10) / 10}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularRate;