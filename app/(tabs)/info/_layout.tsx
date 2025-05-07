// app/(tabs)/events/_layout.tsx
import { Stack } from 'expo-router';

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
      }}
    />
  );
}
