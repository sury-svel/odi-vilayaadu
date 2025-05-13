// app/_layout.tsx
import React, { useEffect, ReactElement } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";

import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { registerForPushNotificationsAsync } from "@/utils/notification";

export default function RootLayout(): ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({ ...FontAwesome.font });
  const { fetchEvents } = useEventsStore();
  const { fetchUser, user, registerPushToken } = useAuthStore();

  // 0️⃣ Crash early on font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // 1️⃣ Once fonts are loaded, hide splash, init data, and setup notifications
  useEffect(() => {
    if (!fontsLoaded) return;

    // Hide splash screen now that fonts & initial fetchUser have started
    SplashScreen.hideAsync();

    // Fetch initial app data
    fetchEvents();
    fetchUser().catch(err => {
      if (err.name !== "UserUnAuthenticatedException") {
        console.error("Error checking auth state:", err);
      }
    });

    // Notification handler: always show alerts/banners
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Android channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Foreground listener
    const recvSub = Notifications.addNotificationReceivedListener(n => {
      console.log("🔔 Notification received:", n);
    });
    // Tap-response listener
    const respSub = Notifications.addNotificationResponseReceivedListener(r => {
      console.log("👆 Notification response:", r);
    });

    return () => {
      recvSub.remove();
      respSub.remove();
    };
  }, [fontsLoaded, fetchEvents, fetchUser]);

  // 2️⃣ When user logs in (or changes), register their push token
  useEffect(() => {
    if (!fontsLoaded || !user) return;

    (async () => {
      // (optional) quick visual canary to confirm this effect ran:
      // Alert.alert("Push", "Registering for push notifications");
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("Registering new push token:", token);
        await registerPushToken(token);
      }
    })();
  }, [fontsLoaded, user, registerPushToken]);

  // Don’t render anything until fonts are loaded
  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
