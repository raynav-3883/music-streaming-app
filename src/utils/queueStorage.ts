import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "MUSIC_QUEUE";

export const saveQueue = async (queue: any[]) => {
  try {
    await AsyncStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(queue)
    );
  } catch (e) {
    console.log("Error saving queue", e);
  }
};

export const loadQueue = async () => {
  try {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Error loading queue", e);
    return [];
  }
};
