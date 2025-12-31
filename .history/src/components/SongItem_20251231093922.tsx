import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { setSong } from "../redux/playerSlice";
import { addToQueue } from "../redux/queueSlice";
import { getSongById } from "../api/saavnApi";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid } from "react-native";


export default function SongItem({ song }: any) {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const currentSong = useSelector(
    (state: RootState) => state.player.currentSong
  );

  const imageUrl = song.image?.[1]?.url;

  // ▶ PLAY IMMEDIATELY (tap on song row)
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
  };

  // ⋮ SHOW OPTIONS (tap on three dots)
  const showOptions = () => {
    Alert.alert(song.name, "Choose an option", [
      {
        text: "Play now",
        onPress: playNow,
      },
      {
  text: "Add to queue",
  onPress: async () => {
    const fullSong = await getSongById(song.id);

    dispatch(
      addToQueue({
        song: fullSong,
        currentId: currentSong?.id,
      })
    );

    // 🔥 TOAST
    ToastAndroid.show(
      "Added to queue",
      ToastAndroid.SHORT
    );
  },
},

      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
      }}
    >
      {/* 🎵 Song Image */}
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 50, height: 50, borderRadius: 6 }}
      />

      {/* 🎵 Song Info → PLAY */}
      <TouchableOpacity
        style={{ flex: 1, marginLeft: 12 }}
        onPress={playNow}
        activeOpacity={0.7}
      >
        <Text numberOfLines={1} style={{ color: colors.text }}>
          {song.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{ color: colors.secondaryText, fontSize: 12 }}
        >
          {song.primaryArtists}
        </Text>
      </TouchableOpacity>

      {/* ⋮ Options */}
      <TouchableOpacity onPress={showOptions} style={{ paddingLeft: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22 }}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}
