import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getTheme } from "../theme/theme";

export default function PlayerScreen() {
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
        Player Screen
      </Text>
    </View>
  );
}
