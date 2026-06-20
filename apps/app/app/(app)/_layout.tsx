import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/auth/useAuth";
import Colors from "@/constants/Colors";
import { StatusBar } from "react-native";

export default function AppLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.light.surface,
        }}
      >
        <ActivityIndicator color={Colors.light.primary} />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!profileCompleted)
    return <Redirect href="/(onboarding)/completeProfile/address" />;

  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.light.surfaceContainerLow,
            borderTopColor: Colors.light.outlineVariant,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
            shadowColor: "#0c5252",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 8,
          },
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: Colors.light.onSurfaceVariant,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
