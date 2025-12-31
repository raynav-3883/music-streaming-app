import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { setSong } from "../redux/playerSlice";
import { addToQueue } from "../redux/queueSlice";
import { getSongById } from "../api/saavnApi";
import { useNavigation } from "@react-navigation/native";

export default function SongItem({ song }: any) {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);
  const currentSong = useSelector(
    (state: RootState) => state.player.currentSong
  );

  const imageUrl = song.image?.[1]?.url;

  const playNow = async () => {
    const fullSong = await getSongById(song.id);

    dispatch(setSong(fullSong));
    dispatch(
      addToQueue({
        song: fullSong,
        currentId: currentSong?.id,
      })
    );

    navigation.navigate("Player");
    setShowOptionsModal(false);
  };

  const addToQueueHandler = async () => {
    const fullSong = await getSongById(song.id);
    dispatch(
      addToQueue({
        song: fullSong,
        currentId: currentSong?.id,
      })
    );
    ToastAndroid.show("Added to queue", ToastAndroid.SHORT);
    setShowOptionsModal(false);
  };

  return (
    <>
      <View style={[styles.container, { borderBottomColor: colors.card }]}>
        {/* Album Art */}
        <Image
          source={{ uri: imageUrl }}
          style={[styles.albumArt, { backgroundColor: colors.card }]}
        />

        {/* Song Info */}
        <TouchableOpacity
          style={styles.songInfo}
          onPress={playNow}
          activeOpacity={0.7}
        >
          <Text
            numberOfLines={1}
            style={[styles.songName, { color: colors.text }]}
          >
            {song.name}
          </Text>

          <Text
            numberOfLines={1}
            style={[styles.artistName, { color: colors.secondaryText }]}
          >
            {song.primaryArtists}
          </Text>
        </TouchableOpacity>

        {/* Options Button */}
        <TouchableOpacity
          onPress={() => setShowOptionsModal(true)}
          style={[styles.optionsButton, { backgroundColor: `${colors.text}08` }]}
        >
          <Text style={[styles.dotsIcon, { color: colors.text }]}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Song Header in Modal */}
            <View style={styles.modalHeader}>
              <Image
                source={{ uri: imageUrl }}
                style={[styles.modalAlbumArt, { backgroundColor: colors.card }]}
              />
              <View style={styles.modalSongInfo}>
                <Text
                  numberOfLines={2}
                  style={[styles.modalSongName, { color: colors.text }]}
                >
                  {song.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.modalArtistName, { color: colors.secondaryText }]}
                >
                  {song.primaryArtists}
                </Text>
              </View>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={playNow}
                style={[styles.option, { backgroundColor: colors.card }]}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[styles.optionIcon, { color: colors.primary }]}>▶</Text>
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    Play Now
                  </Text>
                  <Text style={[styles.optionDesc, { color: colors.secondaryText }]}>
                    Start playing immediately
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addToQueueHandler}
                style={[styles.option, { backgroundColor: colors.card }]}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[styles.optionIcon, { color: colors.primary }]}>+</Text>
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    Add to Queue
                  </Text>
                  {/* <Text style={[styles.optionDesc, { color: colors.secondaryText }]}>
                    Play
                  </Text> */}
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => setShowOptionsModal(false)}
              style={[styles.cancelButton, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  albumArt: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  songInfo: {
    flex: 1,
    marginLeft: 14,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  artistName: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  optionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalAlbumArt: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  modalSongInfo: {
    flex: 1,
    marginLeft: 16,
  },
  modalSongName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  modalArtistName: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: "500",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});