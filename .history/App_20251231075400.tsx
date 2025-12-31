import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { setupAudioMode } from "./src/utils/audioPlayer";

// 🔹 This component CAN use Redux hooks
function AppContent() {
  useEffect(() => {
    setupAudioMode();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
