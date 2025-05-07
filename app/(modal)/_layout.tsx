// app/(modal)/_layout.tsx
import { Slot, Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',   // renders all children as iOS-style modals
        headerShown: true,       // show a header so users can dismiss
        gestureEnabled: true,   // allow swipe-to-go-back on iOS
      }}
    >
      {/* Slot will render each file in this folder as a Screen */}
      <Slot />
    </Stack>
  );
}
