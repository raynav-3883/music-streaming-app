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
    // 🔹 Add song AFTER currently playing song (real app behavior)
    addToQueue(state, action) {
      const { song, currentId } = action.payload;

      const currentIndex = state.songs.findIndex(
        (s) => s.id === currentId
      );

      if (currentIndex === -1) {
        state.songs.push(song);
      } else {
        state.songs.splice(currentIndex + 1, 0, song);
      }
    },

    // 🔹 Remove song
    removeFromQueue(state, action) {
      state.songs = state.songs.filter(
        (song) => song.id !== action.payload
      );
    },

    // 🔹 Move song UP
    moveUp(state, action) {
      const index = action.payload;
      if (index > 0) {
        const temp = state.songs[index - 1];
        state.songs[index - 1] = state.songs[index];
        state.songs[index] = temp;
      }
    },

    // 🔹 Move song DOWN
    moveDown(state, action) {
      const index = action.payload;
      if (index < state.songs.length - 1) {
        const temp = state.songs[index + 1];
        state.songs[index + 1] = state.songs[index];
        state.songs[index] = temp;
      }
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
  moveUp,
  moveDown,
  clearQueue,
  setQueue,
} = queueSlice.actions;

export default queueSlice.reducer;
