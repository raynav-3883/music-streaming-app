import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import {
  removeFromQueue,
  moveUp,
  moveDown,
} from "../redux/queueSlice";
import { setSong } from "../redux/playerSlice";

export default function QueueScreen() {
  const dispatch = useDispatch();

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  const queue = useSelector((state: RootState) => state.queue.songs);
  const currentSong = useSelector(
    (state: RootState) => state.player.currentSong
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.card,
            }}
          >
            <TouchableOpacity onPress={() => dispatch(setSong(item))}>
              <Text
                style={{
                  color:
                    item.id === currentSong?.id
                      ? colors.primary
                      : colors.text,
                }}
              >
                {item.name}
              </Text>

              {item.id === currentSong?.id && (
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.secondaryText,
                  }}
                >
                  Now Playing
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => dispatch(moveUp(index))}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: colors.text }}>⬆</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => dispatch(moveDown(index))}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: colors.text }}>⬇</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => dispatch(removeFromQueue(item.id))}
              >
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
