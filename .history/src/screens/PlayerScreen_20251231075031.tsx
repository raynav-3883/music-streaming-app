import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause } from "../redux/playerSlice";
import { playSound, pauseSound, resumeSound } from "../utils/audioPlayer";
import { useEffect } from "react";
import Slider from "@react-native-community/slider";
import { getStatus, seekTo } from "../utils/audioPlayer";
import { formatTime } from "../utils/time";
import { useState } from "react";

export default function PlayerScreen() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );


useEffect(() => {
  if (!currentSong) return;

  const audioUrl = currentSong.downloadUrl[0].url;

  playSound(audioUrl);
  dispatch(play()); // ✅ THIS WAS MISSING
}, [currentSong]);



  if (!currentSong) {
    return null;
  }

 const imageUrl = currentSong.image?.[2]?.url;


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: 250,
          height: 250,
          borderRadius: 12,
          alignSelf: "center",
        }}
      />

      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        {currentSong.name}
      </Text>

      <Text
        style={{
          color: colors.secondaryText,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {currentSong.primaryArtists}
      </Text>

      <TouchableOpacity
        onPress={async () => {
          if (isPlaying) {
            await pauseSound();
            dispatch(pause());
          } else {
            await resumeSound();
            dispatch(play());
          }
        }}
        style={{
          marginTop: 40,
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 50,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
