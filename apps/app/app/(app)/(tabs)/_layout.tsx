import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/ui/Icon";
import { colors, fonts } from "@/theme";

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon
        name={name}
        size={22}
        color={focused ? colors.charcoal : colors.textSubtle}
        strokeWidth={focused ? 2.1 : 1.8}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.charcoal,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11.5, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 64 + Math.max(insets.bottom, Platform.OS === "web" ? 8 : 10),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "web" ? 8 : 10),
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings", tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} /> }}
      />
      <Tabs.Screen
        name="pets"
        options={{ title: "Pets", tabBarIcon: ({ focused }) => <TabIcon name="paw" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Account", tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.honeySoft,
  },
});
