import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";
import { searchSongs } from "../api/saavnApi";
import SongItem from "../components/SongItem";

// Suggested songs queries
const SUGGESTED_QUERIES = [
  { id: "suggested-1", name: "Tum Hi Ho", query: "tum hi ho" },
  { id: "suggested-2", name: "Sun Raha Hai", query: "sun raha hai" },
  { id: "suggested-3", name: "Sanam Re", query: "sanam re" },
  { id: "suggested-4", name: "Alfaazo", query: "alfaazo" },
];

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
  const [suggestedSongs, setSuggestedSongs] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // 🔹 Fetch suggested songs on mount
  useEffect(() => {
    const fetchSuggestedSongs = async () => {
      setLoadingSuggestions(true);
      const fetchedSongs = [];
      
      for (const suggestion of SUGGESTED_QUERIES) {
        try {
          const data = await searchSongs(suggestion.query);
          if (data && data.length > 0) {
            fetchedSongs.push({
              ...suggestion,
              image: data[0].image,
              fullData: data[0],
            });
          } else {
            // Add without image if no results
            fetchedSongs.push(suggestion);
          }
        } catch (err) {
          console.log("Error fetching suggested song:", suggestion.name, err);
          // Add without image on error
          fetchedSongs.push(suggestion);
        }
      }
      
      setSuggestedSongs(fetchedSongs);
      setLoadingSuggestions(false);
    };

    fetchSuggestedSongs();
  }, []);

  // 🔹 Search songs
  const loadSongs = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await searchSongs(searchTerm);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 🔹 Header */}
      <View style={styles.headerSection}>
        <Text style={[styles.appTitle, { color: colors.text }]}>
          Discover Music
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by song name, artist…"
          placeholderTextColor={colors.secondaryText}
          onSubmitEditing={() => loadSongs()}
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
            },
          ]}
        />

        {/* 🔹 Sort + Theme */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Sort by", "", [
                { text: "Name A–Z", onPress: () => setSortType("AZ") },
                { text: "Name Z–A", onPress: () => setSortType("ZA") },
                { text: "Cancel", style: "cancel" },
              ])
            }
            style={[styles.sortButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.sortButtonText, { color: colors.text }]}>
              ⇅ Sort
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(toggleTheme())}
            style={[styles.themeButton, { backgroundColor: colors.card }]}
          >
            <Text style={styles.themeIcon}>
              {themeMode === "light" ? "🌞" : "🌙"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Suggested Songs Section */}
      {songs.length === 0 && !loading && (
        <View style={styles.suggestedSection}>
          <Text style={[styles.suggestedTitle, { color: colors.text }]}>
            Suggested for you
          </Text>
          
          {loadingSuggestions ? (
            <View style={styles.suggestedGrid}>
              {SUGGESTED_QUERIES.map((song) => (
                <View
                  key={song.id}
                  style={[
                    styles.suggestedCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View
                    style={[
                      styles.musicIcon,
                      { backgroundColor: `${colors.primary}20` },
                    ]}
                  >
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                  <Text
                    style={[styles.suggestedSongName, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {song.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.suggestedGrid}>
              {suggestedSongs.map((song) => (
                <TouchableOpacity
                  key={song.id}
                  onPress={() => {
                    setQuery(song.query);
                    loadSongs(song.query);
                  }}
                  style={[
                    styles.suggestedCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  {song.image ? (
                    <Image
                      source={{ uri: song.image }}
                      style={styles.suggestedImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.musicIcon,
                        { backgroundColor: `${colors.primary}20` },
                      ]}
                    >
                      <Text style={[styles.musicEmoji, { color: colors.primary }]}>
                        ♪
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[styles.suggestedSongName, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {song.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 🔹 Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Searching...
          </Text>
        </View>
      )}

      {/* 🔹 Empty State */}
      {!loading && songs.length === 0 && query.length > 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎵</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No songs found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
            Try searching with different keywords
          </Text>
        </View>
      )}

      {/* 🔹 Song List */}
      {songs.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            Search Results
          </Text>
          <Text style={[styles.resultsCount, { color: colors.secondaryText }]}>
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </Text>
        </View>
      )}

      <FlatList
        data={getSortedSongs()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} />}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: colors.background },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    paddingTop: 16,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  searchInput: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    fontWeight: "500",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sortButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  themeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  themeIcon: {
    fontSize: 20,
  },
  suggestedSection: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  suggestedTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  suggestedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  suggestedCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  suggestedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  musicIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  musicEmoji: {
    fontSize: 28,
    fontWeight: "600",
  },
  suggestedSongName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 90,
  },
});
