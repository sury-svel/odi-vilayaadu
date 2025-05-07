import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen } from 'expo-router';
import React, { useEffect, ReactElement } from 'react';
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
//import { Stack } from "expo-router";

import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";

export default function RootLayout(): ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({ ...FontAwesome.font });
  
  const { fetchEvents } = useEventsStore();
  const { fetchUser } = useAuthStore();


  // Crash early on font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Once fonts are loaded, hide splash and initialize data
  useEffect(() => {
    if (!fontsLoaded) return;
      
      // Initialize data
      fetchEvents();
          
      // Wrap in try/catch to prevent unhandled promise rejection
      fetchUser().catch(error => {
        // Only log critical errors, not authentication state errors
        if (error.name !== "UserUnAuthenticatedException") {
          console.error("Error checking auth state:", error);
        }
      });
  }, [fontsLoaded, fetchEvents, fetchUser]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
        <SafeAreaProvider>
        {/* ← this tells Expo Router “please render my pages here” */}
        <Slot />
      </SafeAreaProvider>
      {/* <RootLayoutNav /> */}
    </ErrorBoundary>
  );
}

// function RootLayoutNav() {
//   const { t } = useTranslation(); // Use the custom hook to ensure re-renders

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
//       {/* Modal auth screens */}
//       <Stack.Screen 
//         name="(modal)/auth/login" 
//         options={{ 
//           presentation: "modal",
//           headerShown: true,
//           title: t("auth.login")
//         }} 
//       />
//       <Stack.Screen 
//         name="(modal)/auth/register" 
//         options={{ 
//           presentation: "modal",
//           headerShown: true,
//           title: t("auth.register")
//         }} 
//       />
      
//       {/* Stack screens */}
//       <Stack.Screen 
//         name="(stack)/events/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("events.title")
//         }} 
//       />
//       <Stack.Screen 
//         name="(stack)/events/edit/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("events.edit.title")
//         }} 
//       />
//       <Stack.Screen 
//         name="(stack)/games/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("games.title")
//         }} 
//       />
//       <Stack.Screen 
//         name="(stack)/games/edit/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("games.title")
//         }} 
//       />
//       <Stack.Screen 
//         name="(stack)/children/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("children.childDetails")
//         }} 
//       />
      
//       {/* Other screens */}
//       <Stack.Screen 
//         name="(stack)/children/add" 
//         options={{ 
//           headerShown: true,
//           title: t("children.addChild")
//         }} 
//       />
//       <Stack.Screen 
//         name="(stack)/children/edit/[id]" 
//         options={{ 
//           headerShown: true,
//           title: t("children.editChild")
//         }} 
//       />
//       <Stack.Screen 
//         name="info/amchats" 
//         options={{ 
//           headerShown: true,
//           title: "AmChaTS"
//         }} 
//       />
//       <Stack.Screen 
//         name="info/aps" 
//         options={{ 
//           headerShown: true,
//           title: "APS"
//         }} 
//       />
//     </Stack>
//   );
// }