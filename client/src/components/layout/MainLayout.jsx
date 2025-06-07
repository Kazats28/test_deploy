import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../common/Footer.jsx";
import GlobalLoading from "../common/GlobalLoading.jsx";
import Topbar from "../common/Topbar.jsx";
import AuthModal from "../common/AuthModal.jsx";
import AdminModal from "../common/AdminModal.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import userApi from "../../api/modules/user.api.js";
import { setUser } from "../../redux/features/userSlice.js";
import { getAdminById } from "../../api-helpers/api-helpers.js";
import { setAdmin } from "../../redux/features/adminSlice.js";
import ScrollToTopButton from "../common/ScrollToTopButton.jsx";
import React from 'react';
const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);
  useEffect(() => {
    const authAdmin = async () => {
      await getAdminById()
        .then((res) => {
          dispatch(setAdmin(res));
        })
        .catch((err) => dispatch(setAdmin(null)));
    };

    authAdmin();
  }, [dispatch]);
  return (
    <>
      {/* global loading */}
      <GlobalLoading />
      {/* global loading */}

      {/* login modal */}
      <AuthModal />
      {/* login modal */}
      <AdminModal />
      <Box display="flex" minHeight="100vh">
        {/* header */}
        <Topbar />
        {/* header */}

        {/* main */}
        <Box
          component="main"
          flexGrow={1}
          overflow="hidden"
          minHeight="100vh"
        >
          <Outlet />
        </Box>
        {/* main */}
      </Box>

      {/* footer */}
      <Footer />
      {/* footer */}
      <ScrollToTopButton/>
    </>
  );
};

export default MainLayout;