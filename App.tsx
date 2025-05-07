// App.tsx
// In your entry App.tsx
import { SplashScreen } from 'expo-router';
import * as Notifications from 'expo-notifications';
import 'expo-router/entry';

// prevent it immediately
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,   
    shouldShowList: true, 
  }),
});

export default function App() {
  return null; // expo-router/entry will render your layouts/screens
}

