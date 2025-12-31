import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";
import { searchSongs } from "../api/saavnApi";
import SongItem from "../components/SongItem";

export default function HomeScreen() {
  const dispatch = useDispatch();

  // 🔹 Theme
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  // 🔹 Local state
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState<"AZ" | "ZA" | null>(null);

  // 🔹 Search songs
  const loadSongs = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
const data = await searchSongs(query);

// 🔥 REMOVE DUPLICATES BY ID
const uniqueSongsMap = new Map();
data.forEach((song: any) => {
  uniqueSongsMap.set(song.id, song);
});

setSongs(Array.from(uniqueSongsMap.values()));

    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sort logic (A–Z / Z–A)
  const getSortedSongs = () => {
    const sorted = [...songs];

    if (sortType === "AZ") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortType === "ZA") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
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

        {/* 🔹 Sort + Theme */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Sort by", "", [
                { text: "Name A–Z", onPress: () => setSortType("AZ") },
                { text: "Name Z–A", onPress: () => setSortType("ZA") },
                { text: "Cancel", style: "cancel" },
              ])
            }
            style={{
              padding: 10,
              backgroundColor: colors.card,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: colors.text }}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(toggleTheme())}
            style={{
              padding: 10,
              backgroundColor: colors.primary,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "#fff" }}>Theme</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Loading */}
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
  data={getSortedSongs()}
  keyExtractor={(item, index) => `${item.id}-${index}`}
  renderItem={({ item }) => <SongItem song={item} />}
  contentContainerStyle={{ paddingBottom: 80 }}
/>

    </View>
  );
}
