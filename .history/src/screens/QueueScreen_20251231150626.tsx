import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import {
  removeFromQueue,
  moveUp,
  moveDown,
} from "../redux/queueSlice";
import { setSong } from "../redux/playerSlice";

export default function QueueScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const queue = useSelector((state: RootState) => state.queue.songs);
  const currentSong = useSelector(
    (state: RootState) => state.player.currentSong
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Up Next
        </Text>
        <Text style={[styles.queueCount, { color: colors.secondaryText }]}>
          {queue.length} {queue.length === 1 ? "song" : "songs"}
        </Text>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.itemCard,
              {
                backgroundColor: item.id === currentSong?.id 
                  ? `${colors.primary}12` 
                  : colors.card,
                borderLeftColor: item.id === currentSong?.id 
                  ? colors.primary 
                  : 'transparent',
              },
            ]}
          >
            <TouchableOpacity 
              onPress={() => dispatch(setSong(item))}
              style={styles.songSection}
            >
              <View style={styles.songInfo}>
                <Text
                  style={[
                    styles.songName,
                    {
                      color: item.id === currentSong?.id
                        ? colors.primary
                        : colors.text,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                {item.id === currentSong?.id && (
                  <View style={styles.nowPlayingBadge}>
                    <View style={[styles.pulsingDot, { backgroundColor: colors.primary }]} />
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
            </TouchableOpacity>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => dispatch(moveUp(index))}
                style={[styles.actionButton, { backgroundColor: `${colors.text}10` }]}
              >
                <Text style={[styles.actionIcon, { color: colors.text }]}>↑</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => dispatch(moveDown(index))}
                style={[styles.actionButton, { backgroundColor: `${colors.text}10` }]}
              >
                <Text style={[styles.actionIcon, { color: colors.text }]}>↓</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => dispatch(removeFromQueue(item.id))}
                style={[styles.actionButton, styles.removeButton]}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  queueCount: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 14,
    borderLeftWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  songSection: {
    padding: 16,
    paddingBottom: 12,
  },
  songInfo: {
    gap: 8,
  },
  songName: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  nowPlayingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nowPlayingText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    marginLeft: 'auto',
  },
  removeText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});