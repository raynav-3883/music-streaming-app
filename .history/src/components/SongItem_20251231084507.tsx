import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";

export default function SongItem({ song, onPress }: any) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", padding: 12 }}>
        <Image
          source={{ uri: song.image?.[1]?.url }}
          style={{ width: 50, height: 50, borderRadius: 6 }}
        />

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: colors.text }} numberOfLines={1}>
            {song.name}
          </Text>
          <Text
            style={{ color: colors.secondaryText, fontSize: 12 }}
            numberOfLines={1}
          >
            {song.primaryArtists}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
