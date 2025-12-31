import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause, setSong } from "../redux/playerSlice";
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

  const queue = useSelector((state: RootState) => state.queue.songs);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // 🔹 Auto-play when song changes
  useEffect(() => {
    if (!currentSong) return;

    const audioUrl = currentSong.downloadUrl[0].url;
    playSound(audioUrl);
    dispatch(play());
  }, [currentSong]);

  // 🔹 Update seek bar every second
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

  const currentIndex = queue.findIndex(
    (song) => song.id === currentSong.id
  );

  const playNext = () => {
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      dispatch(setSong(queue[nextIndex]));
    }
  };

  const playPrevious = () => {
    if (currentIndex === -1) return;

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      dispatch(setSong(queue[prevIndex]));
    }
  };

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

      {/* 🔹 Controls: Previous / Play / Next */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={playPrevious}
          style={{ marginHorizontal: 30 }}
        >
          <Text style={{ fontSize: 22, color: colors.text }}>⏮</Text>
        </TouchableOpacity>

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
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playNext}
          style={{ marginHorizontal: 30 }}
        >
          <Text style={{ fontSize: 22, color: colors.text }}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
