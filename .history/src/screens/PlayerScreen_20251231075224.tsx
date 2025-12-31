import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause } from "../redux/playerSlice";
import {
  playSound,
  pauseSound,
  resumeSound,
  getStatus,
  seekTo,
} from "../utils/audioPlayer";
import { formatTime } from "../utils/time";

export default function PlayerScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // 🔹 Auto play when song changes
  useEffect(() => {
    if (!currentSong) return;

    const audioUrl = currentSong.downloadUrl[0].url;
    playSound(audioUrl);
    dispatch(play());
  }, [currentSong]);

  // 🔹 Update seek bar & time every second
  useEffect(() => {
    const interval = setInterval(async () => {
      const status: any = await getStatus();
      if (status && status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      {/* 🔹 Seek Bar */}
      <View style={{ marginTop: 30 }}>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={(value) => seekTo(value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.secondaryText}
          thumbTintColor={colors.primary}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.secondaryText }}>
            {formatTime(position)}
          </Text>
          <Text style={{ color: colors.secondaryText }}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* 🔹 Play / Pause */}
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
