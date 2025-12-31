import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

// ✅ Configure audio mode ONCE
export const setupAudioMode = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  });
};

export const playSound = async (url: string) => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true }
  );

  sound = newSound;
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
