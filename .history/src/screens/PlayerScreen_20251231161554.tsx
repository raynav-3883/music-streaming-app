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

/* 🔹 Helper to safely extract artist names */
const getArtistNames = (song: any): string => {
  if (typeof song.primaryArtists === "string") {
    return song.primaryArtists;
  }

  if (song.artists?.primary?.length) {
    return song.artists.primary
      .map((artist: any) => artist.name)
      .join(", ");
  }

  return "Unknown Artist";
};

type RepeatMode = "OFF" | "ONE" | "ALL";

export default function PlayerScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const queue = useSelector((state: RootState) => state.queue.songs);

  /* 🔹 Local states */
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("OFF");
  const [shuffle, setShuffle] = useState(false);

  if (!currentSong) return null;

  const currentIndex = queue.findIndex(
    (song) => song.id === currentSong.id
  );

  /* 🔹 Decide next song */
  const playNext = () => {
    if (queue.length === 0 || currentIndex === -1) return;

    // 🔁 Repeat ONE
    if (repeatMode === "ONE") {
      dispatch(setSong(currentSong));
      return;
    }

    // 🔀 Shuffle
    if (shuffle) {
      const remaining = queue.filter(
        (_, idx) => idx !== currentIndex
      );

      if (remaining.length === 0) return;

      const randomSong =
        remaining[Math.floor(Math.random() * remaining.length)];

      dispatch(setSong(randomSong));
      return;
    }

    // ▶ Normal order
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      dispatch(setSong(queue[nextIndex]));
    } else if (repeatMode === "ALL") {
      dispatch(setSong(queue[0]));
    }
  };

  const playPrevious = () => {
    if (currentIndex <= 0) return;
    dispatch(setSong(queue[currentIndex - 1]));
  };

  /* 🔹 Play when song changes */
  useEffect(() => {
    const audioUrl =
      currentSong.downloadUrl.find(
        (d: any) => d.quality === "320kbps"
      )?.url || currentSong.downloadUrl[0].url;

    playSound(audioUrl);
    dispatch(play());
  }, [currentSong]);

  /* 🔹 Seek bar + auto next */
  useEffect(() => {
    const interval = setInterval(async () => {
      const status: any = await getStatus();

      if (status && status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);

        if (
          status.durationMillis &&
          status.positionMillis >= status.durationMillis - 500 &&
          !status.isPlaying
        ) {
          playNext();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSong, queue, shuffle, repeatMode]);

  const imageUrl = currentSong.image?.[2]?.url;
  const artistNames = getArtistNames(currentSong);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
        justifyContent: "center",
      }}
    >
      {/* Album Art */}
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: 250,
          height: 250,
          borderRadius: 12,
          alignSelf: "center",
        }}
      />

      {/* Song Name */}
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

      {/* Artist Name */}
      <Text
        style={{
          color: colors.secondaryText,
          marginTop: 8,
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {artistNames}
      </Text>

      {/* 🔀 Shuffle & 🔁 Repeat */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 24,
          paddingHorizontal: 40,
        }}
      >
        <TouchableOpacity onPress={() => setShuffle(!shuffle)}>
          <Text
            style={{
              fontSize: 18,
              color: shuffle ? colors.primary : colors.secondaryText,
            }}
          >
            🔀
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setRepeatMode((prev) =>
              prev === "OFF" ? "ALL" : prev === "ALL" ? "ONE" : "OFF"
            )
          }
        >
          <Text
            style={{
              fontSize: 18,
              color:
                repeatMode !== "OFF"
                  ? colors.primary
                  : colors.secondaryText,
            }}
          >
            {repeatMode === "ONE" ? "🔂" : "🔁"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seek Bar */}
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

      {/* Controls */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  albumArtContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  songInfoContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 32,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 32,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  controlIcon: {
    fontSize: 28,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});