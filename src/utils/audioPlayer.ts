import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const setupAudioMode = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: false,
  });
};

export const playSound = async (url: string) => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      {
        shouldPlay: true,
        volume: 1.0,
        isMuted: false,
      }
    );

    sound = newSound;
  } catch (e) {
    console.log("Audio error:", e);
  }
};

export const pauseSound = async () => {
  if (sound) {
    await sound.pauseAsync();
  }
};

export const resumeSound = async () => {
  if (sound) {
    await sound.playAsync();
  }
};

export const stopSound = async () => {
  if (sound) {
    await sound.stopAsync();
  }
};

export const getStatus = async () => {
  if (!sound) return null;
  return await sound.getStatusAsync();
};

export const seekTo = async (millis: number) => {
  if (sound) {
    await sound.setPositionAsync(millis);
  }
};
