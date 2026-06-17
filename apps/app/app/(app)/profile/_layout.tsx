import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B0B0F" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="locations" />
    </Stack>
  );
}
