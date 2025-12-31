import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import queueReducer from "./queueSlice";
import themeReducer from "./themeSlice";
export const store=configureStore({
    reducer:{
        player:playerReducer,
        queue:queueReducer,
        theme:themeReducer,
    },
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;