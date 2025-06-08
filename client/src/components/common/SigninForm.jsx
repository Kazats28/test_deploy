import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api.js";
import { setAuthModalOpen } from "../../redux/features/authModalSlice.js";
import { setUser } from "../../redux/features/userSlice.js";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState();
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const signinForm = useFormik({
    initialValues: {
      password: "",
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Địa chỉ Email không hợp lệ.') // Kiểm tra xem có phải là định dạng email không
        .matches(/@gmail\.com$/, 'Email phải kết thúc bằng "@gmail.com".') // Kiểm tra xem có kết thúc bằng "@gmail.com" không
        .required('Hãy nhập địa chỉ Email.'),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 kí tự.")
        .required("Hãy nhập mật khẩu.")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      console.log("");
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);
      if (response) {
        signinForm.resetForm();     
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Đăng nhập thành công!");
      }

      if (err) setErrorMessage(err.message);
    }
  });

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoginRequest(true);
      setErrorMessage(undefined);
      // Gửi credential lên backend để xác thực
      const { response, err } = await userApi.signinWithGoogle({ credential: credentialResponse.credential });
      setIsLoginRequest(false);
      if (response) {
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Đăng nhập Google thành công!");
      }
      if (err) setErrorMessage(err.message);
    } catch (err) {
      setIsLoginRequest(false);
      setErrorMessage("Đăng nhập Google thất bại!");
    }
  };

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="Email"
          name="email"
          fullWidth
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.email && signinForm.errors.email !== undefined}
          helperText={signinForm.touched.email && signinForm.errors.email}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.password && signinForm.errors.password !== undefined}
          helperText={signinForm.touched.password && signinForm.errors.password}
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
      </Stack>

      <Stack spacing={2} mt={4}>
        <LoadingButton
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          loading={isLoginRequest}
        >
          đăng nhập
        </LoadingButton>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            '& > div': {
              width: '100% !important',
              display: 'flex',
              justifyContent: 'center'
            }
          }}
        >
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setErrorMessage("Đăng nhập Google thất bại!")}
          />
        </Box>

        <Button
          fullWidth
          variant="text"
          onClick={() => switchAuthState()}
        >
          đăng ký
        </Button>
      </Stack>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;