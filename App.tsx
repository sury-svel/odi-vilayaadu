// App.tsx
import React, { useEffect } from "react";
import { SplashScreen } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { supabase } from "@/config/supabase";
import { useAuthStore } from "./store/auth-store";
import "expo-router/entry";

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
    console.log ("Fetching user during startup...");

    const router = useRouter();
    const fetchUser = useAuthStore((s) => s.fetchUser);

    useEffect(() => {
      // 1️⃣ Rehydrate auth state on startup
      fetchUser()
        .catch(console.error)
        .finally(() => {
          // Once store is hydrated, hide the splash
          SplashScreen.hideAsync();
        });

      // 2️⃣ Listen for magic-link deep links
      const subscription = Linking.addEventListener("url", ({ url }) => {
        const { queryParams, path } = Linking.parse(url);

        // If it’s a magic link, rehydrate the session and navigate home
        if (
          path === "home" &&
          queryParams?.type === "magiclink" &&
          queryParams?.access_token
        ) {
          supabase.auth
            .setSession({
              access_token: String(queryParams.access_token),
              refresh_token: String(queryParams.refresh_token),
            })
            .then(() => {
              router.replace("/"); // or your post-login route
            })
            .catch(console.error);
        }
      });

      return () => subscription.remove();
    }, []);

  return null; // expo-router/entry will render your layouts/screens
}


