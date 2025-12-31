import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause } from "../redux/playerSlice";
import { pauseSound, resumeSound } from "../utils/audioPlayer";
import { useNavigation } from "@react-navigation/native";

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  // ✅ ALL hooks at top (NO conditions)
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  // ✅ Conditional rendering ONLY in JSX
  if (!currentSong) {
    return null;
  }

  const imageUrl = currentSong.image?.[0]?.url;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Player")}
      activeOpacity={0.9}
    >
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
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 45, height: 45, borderRadius: 6 }}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
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
        >
          <Text style={{ color: colors.primary, fontSize: 18 }}>
            {isPlaying ? "❚❚" : "▶"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
