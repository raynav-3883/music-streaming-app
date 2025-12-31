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
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";
import { searchSongs } from "../api/saavnApi";
import SongItem from "../components/SongItem";

// Navigation type
type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

// Suggested songs queries
const SUGGESTED_QUERIES = [
  { id: "suggested-1", name: "Tum Hi Ho", query: "tum hi ho" },
  { id: "suggested-2", name: "Sun Raha Hai", query: "sun raha hai" },
  { id: "suggested-3", name: "Sanam Re", query: "sanam re" },
  { id: "suggested-4", name: "Alfaazo", query: "alfaazo" },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

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
  const [showSortModal, setShowSortModal] = useState(false);

  // 🔹 Fetch suggested songs on mount
  useEffect(() => {
    const fetchSuggestedSongs = async () => {
      setLoadingSuggestions(true);
      const fetchedSongs = [];
      
      for (const suggestion of SUGGESTED_QUERIES) {
        try {
          const data = await searchSongs(suggestion.query);
          if (data && data.length > 0) {
            // Safely extract image URL (handle string or array)
            let imageUrl = null;
            if (data[0].image) {
              if (typeof data[0].image === 'string') {
                imageUrl = data[0].image;
              } else if (Array.isArray(data[0].image) && data[0].image.length > 0) {
                // If it's an array, get the last/highest quality image
                const lastImage = data[0].image[data[0].image.length - 1];
                imageUrl = lastImage.link || lastImage.url || lastImage;
              }
            }
            
            fetchedSongs.push({
              ...suggestion,
              image: imageUrl,
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

  const loadSongs = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await searchSongs(searchTerm);

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
      <View style={styles.headerSection}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate("Home");
            setQuery("");
            setSongs([]);
            setSortType(null);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Discover Music
          </Text>
        </TouchableOpacity>

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
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={() => setShowSortModal(true)}
            style={[styles.sortButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.sortButtonText, { color: colors.text }]}>
              ⇅ Sort
            </Text>
            {sortType && (
              <View style={[styles.sortBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.sortBadgeText}>
                  {sortType === "AZ" ? "A-Z" : "Z-A"}
                </Text>
              </View>
            )}
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

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", padding: 8 }}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={[styles.modalClose, { color: colors.secondaryText }]}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Sort Songs
            </Text>

            <View style={styles.sortOptions}>
              <TouchableOpacity
                onPress={() => {
                  setSortType("AZ");
                  setShowSortModal(false);
                }}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor: sortType === "AZ" ? `${colors.primary}20` : colors.card,
                    borderColor: sortType === "AZ" ? colors.primary : "transparent",
                  },
                ]}
              >
                <View style={styles.sortOptionContent}>
                  <View style={[styles.sortIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[styles.sortIcon, { color: colors.primary }]}>↓</Text>
                  </View>
                  <View style={styles.sortOptionText}>
                    <Text
                      style={[
                        styles.sortOptionTitle,
                        {
                          color: sortType === "AZ" ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      Name A-Z
                    </Text>
                    <Text style={[styles.sortOptionDesc, { color: colors.secondaryText }]}>
                      Sort alphabetically
                    </Text>
                  </View>
                </View>
                {sortType === "AZ" && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSortType("ZA");
                  setShowSortModal(false);
                }}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor: sortType === "ZA" ? `${colors.primary}20` : colors.card,
                    borderColor: sortType === "ZA" ? colors.primary : "transparent",
                  },
                ]}
              >
                <View style={styles.sortOptionContent}>
                  <View style={[styles.sortIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[styles.sortIcon, { color: colors.primary }]}>↑</Text>
                  </View>
                  <View style={styles.sortOptionText}>
                    <Text
                      style={[
                        styles.sortOptionTitle,
                        {
                          color: sortType === "ZA" ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      Name Z-A
                    </Text>
                    <Text style={[styles.sortOptionDesc, { color: colors.secondaryText }]}>
                      Sort reverse alphabetically
                    </Text>
                  </View>
                </View>
                {sortType === "ZA" && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>

              {sortType && (
                <TouchableOpacity
                  onPress={() => {
                    setSortType(null);
                    setShowSortModal(false);
                  }}
                  style={[
                    styles.sortOption,
                    styles.clearOption,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.sortOptionContent}>
                    <View style={[styles.sortIconContainer, { backgroundColor: `${colors.text}10` }]}>
                      <Text style={[styles.sortIcon, { color: colors.text }]}>⟲</Text>
                    </View>
                    <View style={styles.sortOptionText}>
                      <Text style={[styles.sortOptionTitle, { color: colors.text }]}>
                        Clear Sort
                      </Text>
                      <Text style={[styles.sortOptionDesc, { color: colors.secondaryText }]}>
                        Reset to default order
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
                  {song.image && typeof song.image === 'string' ? (
                    <Image
                      source={{ uri: song.image }}
                      style={styles.suggestedImage}
                      resizeMode="cover"
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

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Searching...
          </Text>
        </View>
      )}

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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  sortBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sortBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalClose: {
    fontSize: 24,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  sortOptions: {
    gap: 12,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  sortIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sortIcon: {
    fontSize: 24,
    fontWeight: "600",
  },
  sortOptionText: {
    flex: 1,
  },
  sortOptionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  sortOptionDesc: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 24,
    fontWeight: "700",
  },
  clearOption: {
    marginTop: 8,
  },
});