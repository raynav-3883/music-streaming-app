import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { setSong } from "../redux/playerSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";
import { searchSongs } from "../api/saavnApi";
import SongItem from "../components/SongItem";
import { useNavigation } from "@react-navigation/native";
import { getSongById } from "../api/saavnApi";
import { addToQueue } from "../redux/queueSlice";


export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    setLoading(true);
    const data = await searchSongs(query);
    setSongs(data);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem
  song={item}
 onPress={async () => {
  const fullSong = await getSongById(item.id);

  dispatch(addToQueue(fullSong));
  dispatch(setSong(fullSong));

  navigation.navigate("Player");
}}

/>


        )}
      />
    </View>
  );
}
