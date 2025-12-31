import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { play, pause } from "../redux/playerSlice";
import { useNavigation } from "@react-navigation/native";
import { playSound, pauseSound, resumeSound } from "../utils/audioPlayer";
import { saveQueue } from "../utils/queueStorage";
import { useEffect } from "react";

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
  const queue = useSelector((state: RootState) => state.queue.songs);

useEffect(() => {
  saveQueue(queue);
}, [queue]);


  const imageUrl = currentSong.image?.[0]?.link;

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
          <Text style={{ color: colors.primary, fontSize: 16 }}>
            {isPlaying ? "❚❚" : "▶"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
