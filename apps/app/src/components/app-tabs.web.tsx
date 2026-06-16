import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';

import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function AppTabs() {
  const { isAuthenticated, user } = useAuth();
  const isProfileCompleted = isAuthenticated && user?.profileStatus === 'PROFILE_COMPLETED';

  return (
    <Tabs style={styles.container}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="house.fill" label="Home" />
          </TabTrigger>
          {isProfileCompleted && (
            <TabTrigger name="bookings" href="/bookings" asChild>
              <TabButton icon="calendar" label="Bookings" />
            </TabTrigger>
          )}
          {isProfileCompleted && (
            <TabTrigger name="profile" href="/profile" asChild>
              <TabButton icon="person.fill" label="Profile" />
            </TabTrigger>
          )}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ icon, label, ...props }: TabTriggerSlotProps & { icon: string; label: string }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const isFocused = props.isFocused;

  return (
    <Pressable {...props} style={[styles.tabButton, isFocused && styles.tabButtonFocused]}>
      <SymbolView
        name={icon as any}
        size={22}
        tintColor={isFocused ? (isDark ? '#ffffff' : '#000000') : '#999999'}
      />
      <ThemedText
        type="code"
        style={[styles.tabLabel, { color: isFocused ? (isDark ? '#ffffff' : '#000000') : '#999999' }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      {...props}
      style={[
        styles.tabBar,
        {
          backgroundColor: isDark ? '#1A1A1A' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#E0E0E0',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  slot: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: Spacing.four,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabButtonFocused: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
