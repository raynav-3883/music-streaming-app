import { useEffect } from "react";
import { setupAudioMode } from "./src/utils/audioPlayer";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useDispatch } from "react-redux";
import { setQueue } from "./src/redux/queueSlice";
import { loadQueue } from "./src/utils/queueStorage";
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setupAudioMode();

    const initQueue = async () => {
      const savedQueue = await loadQueue();
      dispatch(setQueue(savedQueue));
    };

    initQueue();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

