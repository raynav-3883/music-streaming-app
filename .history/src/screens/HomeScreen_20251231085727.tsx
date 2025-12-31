import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";
import { setSong } from "../redux/playerSlice";
import { addToQueue } from "../redux/queueSlice";
import { searchSongs, getSongById } from "../api/saavnApi";
import SongItem from "../components/SongItem";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load songs only when user searches
  const loadSongs = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchSongs(query);
      setSongs(data);
    } catch (e) {
      console.log("Search error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 🔹 Header */}
      <View style={{ padding: 16 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs"
          placeholderTextColor={colors.secondaryText}
          onSubmitEditing={loadSongs}
          style={{
            backgroundColor: colors.card,
            padding: 12,
            borderRadius: 8,
            color: colors.text,
          }}
        />

        <TouchableOpacity
          onPress={() => dispatch(toggleTheme())}
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: colors.primary,
            borderRadius: 6,
            alignSelf: "flex-end",
          }}
        >
          <Text style={{ color: "#fff" }}>Theme</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Loading State */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {/* 🔹 Empty State */}
      {!loading && songs.length === 0 && query.length > 0 && (
        <Text
          style={{
            color: colors.secondaryText,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          No songs found
        </Text>
      )}

      {/* 🔹 Song List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem
  song={item}
  onPress={async () => {
    const fullSong = await getSongById(item.id);

    dispatch(setSong(fullSong));
    dispatch(addToQueue({ ...fullSong, currentId: fullSong.id }));

    navigation.navigate("Player");
  }}
  onLongPress={async () => {
    const fullSong = await getSongById(item.id);

    dispatch(addToQueue({
      ...fullSong,
      currentId: currentSong.id,
    }));
  }}
/>

        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}
