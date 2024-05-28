import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { shazamCoreApi, shazamCoreApiV2 } from "./services/shazamCore";

export const store = configureStore({
  reducer: {
    [shazamCoreApi.reducerPath]: shazamCoreApi.reducer,
    [shazamCoreApiV2.reducerPath]: shazamCoreApiV2.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      shazamCoreApi.middleware,
      shazamCoreApiV2.middleware
    ),
});
