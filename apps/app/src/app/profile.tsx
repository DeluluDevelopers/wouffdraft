import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <ThemedView style={s.flex}>
      <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={s.scroll}>
          {/* Header */}
          <ThemedText style={s.pageTitle}>Profile</ThemedText>

          {/* User card */}
          <View style={[s.profileCard, { backgroundColor: theme.backgroundElement }]}>
            <SymbolView name="person.crop.circle.fill" size={56} tintColor={theme.tint} />
            <View style={s.userInfo}>
              <ThemedText style={s.userName}>{user?.name || 'User'}</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }}>{user?.phoneNumber}</ThemedText>
            </View>
          </View>

          {/* Locations */}
          <ThemedText style={s.secTitle}>Locations</ThemedText>
          {user?.location?.length ? (
            user.location.map((loc) => (
              <View key={loc.id} style={[s.itemCard, { backgroundColor: theme.backgroundElement }]}>
                <SymbolView name="mappin.circle.fill" size={18} tintColor={theme.tint} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontWeight: '600' }}>{loc.label}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }} numberOfLines={2}>
                    {loc.address}
                  </ThemedText>
                </View>
              </View>
            ))
          ) : (
            <ThemedView type="backgroundElement" style={s.empty}>
              <ThemedText themeColor="textSecondary">No locations set.</ThemedText>
            </ThemedView>
          )}

          {/* Pets */}
          <ThemedText style={s.secTitle}>Pets</ThemedText>
          {user?.pets?.length ? (
            <View style={s.petsGrid}>
              {user.pets.map((pet) => (
                <View key={pet.id} style={[s.petCard, { backgroundColor: theme.backgroundElement }]}>
                  <View style={s.petIconRow}>
                    <SymbolView name={pet.species === 'Dog' ? 'dog.fill' : 'cat.fill'} size={22} tintColor={theme.tint} />
                    <View style={[s.genderBadge, { backgroundColor: theme.backgroundSelected }]}>
                      <ThemedText style={{ fontSize: 9, fontWeight: '700' }}>{pet.gender}</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={{ fontWeight: '700', marginTop: 4 }}>{pet.name}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={{ fontSize: 12 }}>{pet.breed || pet.species}</ThemedText>
                  <View style={[s.divider, { backgroundColor: theme.border }]} />
                  <View style={s.detailRow}>
                    <ThemedText themeColor="textSecondary" style={{ fontSize: 12 }}>Age</ThemedText>
                    <ThemedText style={{ fontSize: 12, fontWeight: '600' }}>{pet.ageMonths}mo</ThemedText>
                  </View>
                  <View style={s.detailRow}>
                    <ThemedText themeColor="textSecondary" style={{ fontSize: 12 }}>Vaccine</ThemedText>
                    <ThemedText style={{ fontSize: 12, fontWeight: '600' }}>
                      {pet.vaccinationStatus === 'UpToDate' ? 'Up to date' : pet.vaccinationStatus}
                    </ThemedText>
                  </View>
                  {pet.medicalConditions && (
                    <View style={s.medAlert}>
                      <SymbolView name="exclamationmark.triangle.fill" size={10} tintColor="#FF3B30" style={{ marginRight: 4 }} />
                      <ThemedText style={{ fontSize: 10, color: '#FF3B30', fontWeight: '600' }}>Medical condition</ThemedText>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <ThemedView type="backgroundElement" style={s.empty}>
              <ThemedText themeColor="textSecondary">No pets registered.</ThemedText>
            </ThemedView>
          )}

          {/* Support */}
          <View style={[s.supportCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={{ fontWeight: '600', fontSize: 16 }}>Need help?</ThemedText>
            <ThemedText themeColor="textSecondary" style={{ fontSize: 13, marginTop: 4 }}>
              Contact support anytime.
            </ThemedText>
            <View style={[s.supportBtn, { borderColor: theme.border }]}>
              <SymbolView name="phone.bubble.left.fill" size={14} tintColor={theme.tint} style={{ marginRight: 6 }} />
              <ThemedText style={{ fontWeight: '600', fontSize: 13 }}>Contact support</ThemedText>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={s.logoutBtn} onPress={logout}>
            <SymbolView name="power" size={16} tintColor="#ffffff" style={{ marginRight: 8 }} />
            <ThemedText style={{ color: '#ffffff', fontWeight: '700' }}>Log out</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, alignSelf: 'center', width: '100%' },
  scroll: { padding: Spacing.four, paddingBottom: BottomTabInset + Spacing.five, gap: Spacing.four },
  pageTitle: { fontSize: 26, fontWeight: '800' },
  profileCard: { flexDirection: 'row', padding: 16, borderRadius: 10, gap: 16, alignItems: 'center' },
  userInfo: { gap: 2 },
  userName: { fontWeight: '700', fontSize: 18 },
  secTitle: { fontSize: 18, fontWeight: '700' },
  itemCard: { flexDirection: 'row', padding: 14, borderRadius: 8, alignItems: 'center' },
  empty: { padding: 24, borderRadius: 8, alignItems: 'center' },
  petsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  petCard: { width: '47%', padding: 14, borderRadius: 10, gap: 4 },
  petIconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  genderBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  divider: { height: 1, marginVertical: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  medAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.08)', padding: 6, borderRadius: 6, marginTop: 4 },
  supportCard: { padding: 18, borderRadius: 10, gap: 8 },
  supportBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 42, borderWidth: 1, borderRadius: 8, marginTop: 4 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, backgroundColor: '#000000', borderRadius: 10 },
});
