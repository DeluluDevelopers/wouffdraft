import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "react-native";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/ui/LoadingScreen";
import { HomeIcon, CalendarIcon, ProfileTabIcon } from "@/components/icons/NavIcons";
import Colors from "@/constants/Colors";

export default function AppLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!profileCompleted)
    return <Redirect href="/(onboarding)/completeProfile/address" />;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.light.surfaceContainerLowest,
            borderTopColor: Colors.light.outlineVariant,
            borderTopWidth: 1.5,
            height: 70,
            paddingBottom: 12,
            paddingTop: 10,
          },
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: Colors.light.outline,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            tabBarIcon: ({ color, size }) => <CalendarIcon size={size} color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => <ProfileTabIcon size={size} color={color as string} />,
          }}
        />
      </Tabs>
    </>
  );
}
