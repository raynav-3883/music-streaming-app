MUSIC STREAMING APP
This is a React Native music streaming application built as part of an intern assignment.
The app uses the JioSaavn public API to search and play songs and focuses on clean architecture, proper state management, and smooth user experience.

FEATURES:-
Home Screen-
-Search songs by song name / artist

-Clean search UI with rounded search box

-Sorting options (A–Z, Z–A)

-Three-dot menu for each song: WITH PLAY AND ADD TO QUEUE



PLAYER SCREEN-
-Full music player with:-PLAY/PAUSE,NEXT/PREVIOUS,TIME PROGRESS
-Displays:-Song name,Artist name

SHUFFLE MODE
REPEAT MODES
Automatically plays next song from queue

---------------------------------------------------

MINI PLAYER
-Persistent mini player at the bottom
-Synced perfectly with full player
-Play / Pause from mini player
-Tap to open full player

---------------------------------------------------

QUEUE MANAGEMENT
-Add songs to queue
-Prevent duplicate songs in queue
-Reorder queue (move up / down)
-Remove songs from queue
-Automatically plays next song from queue
-Queue state is persisted locally

---------------------------------------------------
THEME SUPPORT
-Light Theme
-Dark Theme

---------------------------------------------------
BACKGROUND PLAYBACK
-MUSIC PLAYS WHEN-
APP IS MINIMIZDED 
AND
SCREEN IS LOCKED

---------------------------------------------------
TECH STACK
-React Native (Expo)
-TypeScript
-Redux Toolkit – global state management
-expo-av – audio playback
-Expo Updates (OTA) – over-the-air updates
-JioSaavn API – music data source

---------------------------------------------------

ARCHITECTURE VIEW
-Redux is used to manage:
-Current playing song
-Playback state (play / pause)
-Queue state
-Theme mode
-Player logic (shuffle, repeat, auto-next) is handled inside the Player screen
-Audio handling is isolated inside a utility (audioPlayer.ts)
-UI components are kept reusable and clean

---------------------------------------------------
src/
├── api/            # JioSaavn API calls
├── components/     # Reusable UI components
├── redux/          # Redux slices (player, queue, theme)
├── screens/        # Home, Player, Queue screens
├── theme/          # Light / Dark theme colors
├── utils/          # Audio player, helpers
