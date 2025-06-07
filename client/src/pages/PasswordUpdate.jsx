import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Box, Stack, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import { useState, useEffect } from "react";
import userApi from "../api/modules/user.api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice.js";
import { setAuthModalOpen } from "../redux/features/authModalSlice.js";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React from 'react';

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);
  const [showPassword, setShowPassword] = useState();
  const [showPassword1, setShowPassword1] = useState();
  const [showPassword2, setShowPassword2] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const { response, err } = await userApi.getInfo();
      if (response) setUserInfo(response);
    };
    fetchUser();
  }, []);

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 kí tự.")
        .required("Hãy nhập mật khẩu cũ."),
      newPassword: Yup.string()
        .min(8, "Mật khẩu mới phải có ít nhất 8 kí tự.")
        .required("Hãy nhập mật khẩu mới."),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu không trùng khớp.")
        .min(8, "Mật khẩu xác nhận phải có ít nhất 8 kí tự.")
        .required("Hãy nhập mật khẩu mới để xác nhận.")
    }),
    onSubmit: async values => onUpdate(values)
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Đổi mật khẩu thành công!");
    }
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="Thông tin tài khoản">
        <Box maxWidth="400px" sx={{ mb: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={userInfo?.email || ""}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Số dư ví"
              value={userInfo?.wallet !== undefined ? userInfo.wallet + " VNĐ" : ""}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => setShowForm(!showForm)}
              sx={{ mt: 2 }}
            >
              {showForm ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
            </Button>
          </Stack>
        </Box>
        {showForm && (
          <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu cũ"
                name="password"
                fullWidth
                value={form.values.password}
                onChange={form.handleChange}
                color="success"
                error={form.touched.password && form.errors.password !== undefined}
                helperText={form.touched.password && form.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type={showPassword1 ? 'text' : 'password'}
                placeholder="Mật khẩu mới"
                name="newPassword"
                fullWidth
                value={form.values.newPassword}
                onChange={form.handleChange}
                color="success"
                error={form.touched.newPassword && form.errors.newPassword !== undefined}
                helperText={form.touched.newPassword && form.errors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword1(!showPassword1)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword1 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type={showPassword2 ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                fullWidth
                value={form.values.confirmNewPassword}
                onChange={form.handleChange}
                color="success"
                error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
                helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword2(!showPassword2)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword2 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: 4 }}
                loading={onRequest}
              >
                Đổi mật khẩu
              </LoadingButton>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PasswordUpdate;