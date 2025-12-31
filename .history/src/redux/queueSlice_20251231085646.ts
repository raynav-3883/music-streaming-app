import { createSlice } from "@reduxjs/toolkit";

type Song = any;

type QueueState = {
  songs: Song[];
};

const initialState: QueueState = {
  songs: [],
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
   addToQueue(state, action) {
  const song = action.payload;
  const currentIndex = state.songs.findIndex(
    (s) => s.id === action.payload.currentId
  );

  if (currentIndex === -1) {
    state.songs.push(song);
  } else {
    state.songs.splice(currentIndex + 1, 0, song);
  }
},

    removeFromQueue(state, action) {
      state.songs = state.songs.filter(
        (song) => song.id !== action.payload
      );
    },
    clearQueue(state) {
      state.songs = [];
    },
    setQueue(state, action) {
      state.songs = action.payload;
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  clearQueue,
  setQueue,
} = queueSlice.actions;

export default queueSlice.reducer;
