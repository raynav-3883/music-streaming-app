import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
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
  };

  const showOptions = () => {
    Alert.alert(song.name, "Choose an option", [
      { text: "Play now", onPress: playNow },
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
          ToastAndroid.show("Added to queue", ToastAndroid.SHORT);
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.card,
      }}
    >
      {/* Album Art */}
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 8,
          backgroundColor: colors.card,
        }}
      />

      {/* Song Info */}
      <TouchableOpacity
        style={{ flex: 1, marginLeft: 14 }}
        onPress={playNow}
        activeOpacity={0.7}
      >
        <Text
          numberOfLines={1}
          style={{
            color: colors.text,
            fontSize: 15,
            fontWeight: "500",
          }}
        >
          {song.name}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: colors.secondaryText,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {song.primaryArtists}
        </Text>
      </TouchableOpacity>

      {/* Three dots */}
      <TouchableOpacity
        onPress={showOptions}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        <Text style={{ color: colors.secondaryText, fontSize: 22 }}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}
