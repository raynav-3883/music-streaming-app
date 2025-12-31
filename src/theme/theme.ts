import { lightColors, darkColors } from "./colors";

export type ThemeMode = "light" | "dark";

export const getTheme = (mode: ThemeMode) => {
  return mode === "dark" ? darkColors : lightColors;
};
