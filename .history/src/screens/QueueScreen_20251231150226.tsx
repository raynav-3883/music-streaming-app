import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { removeFromQueue, moveUp, moveDown } from "../redux/queueSlice";
import { setSong } from "../redux/playerSlice";
import { useRef, useEffect } from "react";

export default function QueueScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const queue = useSelector((state: RootState) => state.queue.songs);
  const currentSong = useSelector(
    (state: RootState) => state.player.currentSong
  );

  const QueueItem = ({ item, index }: { item: any; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isCurrentSong = item.id === currentSong?.id;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isCurrentSong
              ? `${colors.primary}15`
              : colors.card,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => dispatch(setSong(item))}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.songTouchable}
          activeOpacity={1}
        >
          <View style={styles.leftSection}>
            {/* Queue number or playing indicator */}
            <View
              style={[
                styles.numberBadge,
                isCurrentSong && {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              {isCurrentSong ? (
                <View style={styles.playingIndicator}>
                  <View
                    style={[
                      styles.playingBar,
                      { backgroundColor: colors.background },
                    ]}
                  />
                  <View
                    style={[
                      styles.playingBar,
                      { backgroundColor: colors.background, height: 14 },
                    ]}
                  />
                  <View
                    style={[
                      styles.playingBar,
                      { backgroundColor: colors.background },
                    ]}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    styles.numberText,
                    { color: colors.secondaryText },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Song info */}
            <View style={styles.songInfo}>
              <Text
                style={[
                  styles.songName,
                  {
                    color: isCurrentSong ? colors.primary : colors.text,
                    fontWeight: isCurrentSong ? "700" : "600",
                  },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.artist && (
                <Text
                  style={[
                    styles.artistName,
                    { color: colors.secondaryText },
                  ]}
                  numberOfLines={1}
                >
                  {item.artist}
                </Text>
              )}
              {isCurrentSong && (
                <View style={styles.nowPlayingBadge}>
                  <View
                    style={[
                      styles.nowPlayingDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <Text
                    style={[
                      styles.nowPlayingText,
                      { color: colors.primary },
                    ]}
                  >
                    Now Playing
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Duration (if available) */}
          {item.duration && (
            <Text
              style={[styles.durationText, { color: colors.secondaryText }]}
            >
              {item.duration}
            </Text>
          )}
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => dispatch(moveUp(index))}
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.text}08` },
            ]}
            disabled={index === 0}
          >
            <Text
              style={[
                styles.actionIcon,
                {
                  color: index === 0 ? colors.secondaryText : colors.text,
                  opacity: index === 0 ? 0.3 : 1,
                },
              ]}
            >
              ↑
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(moveDown(index))}
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.text}08` },
            ]}
            disabled={index === queue.length - 1}
          >
            <Text
              style={[
                styles.actionIcon,
                {
                  color:
                    index === queue.length - 1
                      ? colors.secondaryText
                      : colors.text,
                  opacity: index === queue.length - 1 ? 0.3 : 1,
                },
              ]}
            >
              ↓
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(removeFromQueue(item.id))}
            style={[
              styles.actionButton,
              styles.removeButton,
              { backgroundColor: "#ff3b3010" },
            ]}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Queue
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
          {queue.length} {queue.length === 1 ? "song" : "songs"}
        </Text>
      </View>

      {/* Queue List */}
      {queue.length > 0 ? (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <QueueItem item={item} index={index} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: colors.secondaryText }]}>
            ♪
          </Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Queue is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
            Add songs to start building your queue
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  songTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700",
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
  },
  playingBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 17,
    marginBottom: 3,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "500",
  },
  nowPlayingBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  nowPlayingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  nowPlayingText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  removeButton: {
    marginLeft: 4,
  },
  removeIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff3b30",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});