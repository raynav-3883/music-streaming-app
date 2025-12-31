import { View, Text, Image, TouchableOpacity } from "react-native";

type Props = {
  song: any;
  onPress: () => void;
};

export default function SongItem({ song, onPress }: Props) {
  const imageUrl = song.image?.[1]?.link;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 6 }}
        />

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text numberOfLines={1} style={{ fontSize: 16 }}>
            {song.name}
          </Text>
          <Text numberOfLines={1} style={{ color: "#666", fontSize: 12 }}>
            {song.primaryArtists}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
