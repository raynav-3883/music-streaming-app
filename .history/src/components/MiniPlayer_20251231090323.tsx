import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause } from "../redux/playerSlice";
import { pauseSound, resumeSound } from "../utils/audioPlayer";
import { useNavigation } from "@react-navigation/native";

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  if (!currentSong) {
    return null;
  }

  const imageUrl = currentSong.image?.[0]?.url;

  return (
    <View
      style={{
        height: 70,
        backgroundColor: colors.card,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: colors.secondaryText,
      }}
    >
      {/* 🔹 Song Info → Player */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Player")}
        style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 45, height: 45, borderRadius: 6 }}
        />

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text numberOfLines={1} style={{ color: colors.text }}>
            {currentSong.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: colors.secondaryText, fontSize: 12 }}
          >
            {currentSong.primaryArtists}
          </Text>
        </View>
      </TouchableOpacity>

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
        style={{ marginRight: 12 }}
      >
        <Text style={{ color: colors.primary, fontSize: 18 }}>
          {isPlaying ? "❚❚" : "▶"}
        </Text>
      </TouchableOpacity>

      {/* 🔹 Queue Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Queue")}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}
