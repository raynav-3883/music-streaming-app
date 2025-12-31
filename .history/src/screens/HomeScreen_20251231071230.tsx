import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";
import { toggleTheme } from "../redux/themeSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = getTheme(themeMode);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18 }}>
        Home Screen
      </Text>

      <TouchableOpacity
        onPress={() => dispatch(toggleTheme())}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: colors.primary,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>
          Toggle Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
}
