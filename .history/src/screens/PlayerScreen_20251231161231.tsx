import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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

type RepeatMode = "OFF" | "ONE" | "ALL";

export default function PlayerScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const queue = useSelector((state: RootState) => state.queue.songs);

  // ✅ Hooks MUST be at top
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("OFF");
  const [shuffle, setShuffle] = useState(false);

  if (!currentSong) return null;

  const currentIndex = queue.findIndex(
    (song) => song.id === currentSong.id
  );

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

  // 🔹 Play song when currentSong changes
  useEffect(() => {
    const audioUrl =
      currentSong.downloadUrl.find(
        (d: any) => d.quality === "320kbps"
      )?.url || currentSong.downloadUrl[0].url;

    playSound(audioUrl);
    dispatch(play());
  }, [currentSong]);

  // 🔹 Update seek bar + AUTO NEXT
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Album Art */}
      <View style={styles.albumArtContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.albumArt}
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfoContainer}>
        <Text
          style={[styles.songTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {currentSong.name}
        </Text>

        <Text
          style={[styles.artistName, { color: colors.secondaryText }]}
          numberOfLines={1}
        >
          {currentSong.primaryArtists}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={(value) => seekTo(value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={`${colors.secondaryText}40`}
          thumbTintColor={colors.primary}
        />

        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.secondaryText }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, { color: colors.secondaryText }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={playPrevious}
          style={[styles.controlButton, { backgroundColor: colors.card }]}
          disabled={currentIndex <= 0}
        >
          <Text
            style={[
              styles.controlIcon,
              {
                color: currentIndex <= 0 ? colors.secondaryText : colors.text,
                opacity: currentIndex <= 0 ? 0.3 : 1,
              },
            ]}
          >
            ⏮
          </Text>
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
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? "❚❚" : "▶"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playNext}
          style={[styles.controlButton, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.controlIcon, { color: colors.text }]}>
            ⏭
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔀 Shuffle & 🔁 Repeat */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          onPress={() => setShuffle(!shuffle)}
          style={[
            styles.optionButton,
            {
              backgroundColor: shuffle ? `${colors.primary}20` : colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.optionIcon,
              {
                color: shuffle ? colors.primary : colors.secondaryText,
              },
            ]}
          >
            🔀
          </Text>
          <Text
            style={[
              styles.optionLabel,
              {
                color: shuffle ? colors.primary : colors.secondaryText,
              },
            ]}
          >
            Shuffle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setRepeatMode((prev) =>
              prev === "OFF" ? "ALL" : prev === "ALL" ? "ONE" : "OFF"
            )
          }
          style={[
            styles.optionButton,
            {
              backgroundColor:
                repeatMode !== "OFF" ? `${colors.primary}20` : colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.optionIcon,
              {
                color:
                  repeatMode !== "OFF"
                    ? colors.primary
                    : colors.secondaryText,
              },
            ]}
          >
            {repeatMode === "ONE" ? "🔂" : "🔁"}
          </Text>
          <Text
            style={[
              styles.optionLabel,
              {
                color:
                  repeatMode !== "OFF"
                    ? colors.primary
                    : colors.secondaryText,
              },
            ]}
          >
            {repeatMode === "ONE"
              ? "Repeat One"
              : repeatMode === "ALL"
              ? "Repeat All"
              : "Repeat"}
          </Text>
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