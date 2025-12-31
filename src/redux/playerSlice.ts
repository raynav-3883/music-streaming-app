import { createSlice } from "@reduxjs/toolkit";

type Song = {
  id: string;
  name: string;
  image: any[];
  primaryArtists: string;
  downloadUrl: any[];
};

type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
};

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSong(state, action) {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
  },
});

export const { setSong, play, pause } = playerSlice.actions;
export default playerSlice.reducer;
