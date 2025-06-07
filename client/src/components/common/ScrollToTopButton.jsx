import { useState, useEffect } from 'react';
import { IconButton } from "@mui/material";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@mui/icons-material";
import React from 'react';
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Thêm sự kiện lắng nghe khi cuộn trang
    window.addEventListener("scroll", handleScroll);

    // Xóa sự kiện khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hàm xử lý cuộn trang
  const handleScroll = () => {
    // Kiểm tra vị trí cuộn, nếu lớn hơn 100px thì hiển thị nút, ngược lại ẩn nút
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm xử lý khi click nút để cuộn lên đầu trang
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Cuộn mượt
    });
  };

  return (
    <IconButton
      onClick={handleScrollToTop}
      sx={{
        position: "fixed",
        bottom: "20px", // Khoảng cách từ dưới lên trên
        right: "20px", // Khoảng cách từ phải sang trái
        zIndex: 1000, // Đảm bảo nút hiển thị trên cùng
        backgroundColor: "#ff0000",
        color: "#fff",
        opacity: isVisible ? 1 : 0, // Ẩn hoặc hiển thị nút
        transition: "opacity 0.3s ease" // Hiệu ứng khi ẩn hoặc hiển thị
      }}
    >
      <KeyboardArrowUpIcon />
    </IconButton>
  );
};

export default ScrollToTopButton;
