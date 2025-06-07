import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice.js";
import authModalSlice from "./features/authModalSlice.js";
import globalLoadingSlice from "./features/globalLoadingSlice.js";
import themeModeSlice from "./features/themeModeSlice.js";
import userSlice from "./features/userSlice.js";
import adminModalSlice from "./features/adminModalSlice.js";
import adminSlice from "./features/adminSlice.js";
const store = configureStore({
  reducer: {
    user: userSlice,
    themeMode: themeModeSlice,
    authModal: authModalSlice,
    globalLoading: globalLoadingSlice,
    appState: appStateSlice,
    adminModal: adminModalSlice,
    admin: adminSlice
  }
});

export default store;