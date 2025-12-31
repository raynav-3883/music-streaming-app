import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

// ✅ Setup audio mode (compatible with latest Expo)
export const setupAudioMode = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
  });
};

export const playSound = async (url: string) => {
  if (sound) {
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
  await sound.playAsync(); // 🔥 FORCE PLAY
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
