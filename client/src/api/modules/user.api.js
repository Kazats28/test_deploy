import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";
import axios from "axios";
import { BACKEND_URL } from "../../configs/config.js";

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  passwordUpdate: "user/update-password"
};

const userApi = {
  signin: async ({ email, password }) => {
    try {
      console.log("send request");
      const response = await publicClient.post(
        userEndpoints.signin,
        { email, password }
      );

      return { response };
    } catch (err) { console.log("err"); return { err }; }
  },
  signup: async ({ email, password, confirmPassword, name }) => {
    try {
      const response = await publicClient.post(
        userEndpoints.signup,
        { email, password, confirmPassword, name }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (err) { return { err }; }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(
        userEndpoints.passwordUpdate,
        { password, newPassword, confirmNewPassword }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  signinWithGoogle: async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/google-login`, data);
      return { response: response.data, err: null };
    } catch (err) {
      return { response: null, err: err.response.data };
    }
  }
};

export default userApi;