import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/services/api';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Booking {
  id: string;
  petId: string;
  type: 'Instant' | 'Scheduled';
  scheduledAt?: string | null;
  createdAt: string;
  pet: {
    id: string;
    name: string;
    species: 'Dog' | 'Cat';
    breed?: string;
  };
}

export default function BookingsScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedPetId, setSelectedPetId] = useState('');
  const [bookingType, setBookingType] = useState<'Instant' | 'Scheduled'>('Instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (user?.pets?.length) setSelectedPetId(user.pets[0].id);
  }, [user]);

  const fetchBookings = async () => {
    setLoadingList(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/bookings');
      if (res.success && res.data) setBookings(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load bookings.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') fetchBookings();
  }, [activeTab]);

  const setPreset = (hoursFromNow: number) => {
    const t = new Date();
    t.setHours(t.getHours() + hoursFromNow);
    setScheduledDate(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`);
    setScheduledTime(`${String(t.getHours()).padStart(2, '0')}:00`);
  };

  const handleCreate = async () => {
    if (!selectedPetId) { setErrorMsg('Select a pet'); return; }
    let iso: string | undefined;
    if (bookingType === 'Scheduled') {
      if (!scheduledDate || !scheduledTime) { setErrorMsg('Enter date and time'); return; }
      const d = new Date(`${scheduledDate}T${scheduledTime}:00`);
      if (isNaN(d.getTime())) { setErrorMsg('Invalid date/time'); return; }
      iso = d.toISOString();
    }
    setBookingLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({ petId: selectedPetId, type: bookingType, scheduledAt: iso }),
      });
      if (res.success) {
        setBookingSuccess(true);
        setBookingType('Instant');
        setScheduledDate('');
        setScheduledTime('');
        setTimeout(() => { setBookingSuccess(false); setActiveTab('list'); }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <ThemedView style={s.flex}>
      <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right']}>
        <ThemedText style={s.pageTitle}>Bookings</ThemedText>

        {/* Toggle */}
        <View style={[s.toggleBar, { backgroundColor: theme.backgroundElement }]}>
          <TouchableOpacity
            style={[s.toggleBtn, activeTab === 'list' && { backgroundColor: theme.background }]}
            onPress={() => { setActiveTab('list'); setErrorMsg(''); }}
          >
            <ThemedText style={[s.toggleText, activeTab === 'list' && { fontWeight: '700' }]}>My bookings</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, activeTab === 'new' && { backgroundColor: theme.background }]}
            onPress={() => { setActiveTab('new'); setErrorMsg(''); }}
          >
            <ThemedText style={[s.toggleText, activeTab === 'new' && { fontWeight: '700' }]}>Book service</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.scroll}>
          {activeTab === 'list' ? (
            loadingList ? (
              <View style={s.center}><ActivityIndicator size="large" color={theme.tint} /></View>
            ) : errorMsg ? (
              <View style={s.center}>
                <ThemedText themeColor="textSecondary">{errorMsg}</ThemedText>
                <TouchableOpacity style={s.retryBtn} onPress={fetchBookings}>
                  <ThemedText style={{ color: '#ffffff', fontWeight: '600', fontSize: 13 }}>Retry</ThemedText>
                </TouchableOpacity>
              </View>
            ) : bookings.length === 0 ? (
              <View style={s.center}>
                <SymbolView name="calendar.badge.exclamationmark" size={40} tintColor={theme.textSecondary} />
                <ThemedText style={{ fontWeight: '600', marginTop: 12 }}>No bookings yet</ThemedText>
                <ThemedText themeColor="textSecondary" style={{ fontSize: 13, marginTop: 4, textAlign: 'center' }}>
                  Schedule your pet's first walk.
                </ThemedText>
                <TouchableOpacity style={s.retryBtn} onPress={() => setActiveTab('new')}>
                  <ThemedText style={{ color: '#ffffff', fontWeight: '600', fontSize: 13 }}>Book a walk</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {bookings.map((b) => (
                  <View key={b.id} style={[s.bookingCard, { backgroundColor: theme.backgroundElement }]}>
                    <View style={s.cardTop}>
                      <View style={s.cardTopLeft}>
                        <SymbolView name={b.pet.species === 'Dog' ? 'dog.fill' : 'cat.fill'} size={20} tintColor={theme.tint} style={{ marginRight: 8 }} />
                        <ThemedText style={{ fontWeight: '700' }}>{b.pet.name}</ThemedText>
                      </View>
                      <View style={[s.typeBadge, { backgroundColor: theme.backgroundSelected }]}>
                        <ThemedText style={{ fontSize: 10, fontWeight: '700' }}>{b.type}</ThemedText>
                      </View>
                    </View>
                    <View style={[s.dash, { backgroundColor: theme.border }]} />
                    <View style={s.row}>
                      <SymbolView name="clock.fill" size={14} tintColor={theme.textSecondary} style={{ marginRight: 6 }} />
                      <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }}>
                        {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'Immediately'}
                      </ThemedText>
                    </View>
                    <View style={s.row}>
                      <SymbolView name="doc.text.fill" size={14} tintColor={theme.textSecondary} style={{ marginRight: 6 }} />
                      <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
                        ID: {b.id.slice(0, 8)}...
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )
          ) : bookingSuccess ? (
            <View style={s.successWrap}>
              <SymbolView name="checkmark.seal.fill" size={48} tintColor={theme.tint} />
              <ThemedText style={{ fontWeight: '800', fontSize: 22, marginTop: 12 }}>Booking placed!</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 14 }}>Your request has been registered.</ThemedText>
            </View>
          ) : (
            <View style={{ gap: 20 }}>
              {/* Select pet */}
              <ThemedText style={s.formLabel}>Select pet</ThemedText>
              {user?.pets?.length ? (
                <View style={s.petGrid}>
                  {user.pets.map((pet) => (
                    <TouchableOpacity
                      key={pet.id}
                      style={[s.petOption, selectedPetId === pet.id && s.petOptionSelected, { borderColor: theme.border, backgroundColor: selectedPetId === pet.id ? '#000000' : theme.backgroundElement }]}
                      onPress={() => setSelectedPetId(pet.id)}
                    >
                      <SymbolView name={pet.species === 'Dog' ? 'dog.fill' : 'cat.fill'} size={20} tintColor={selectedPetId === pet.id ? '#ffffff' : theme.tint} />
                      <ThemedText style={{ fontSize: 13, fontWeight: '600', marginTop: 4, color: selectedPetId === pet.id ? '#ffffff' : theme.text }}>
                        {pet.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <ThemedView type="backgroundElement" style={{ padding: 24, borderRadius: 8, alignItems: 'center' }}>
                  <ThemedText themeColor="textSecondary">Register a pet first.</ThemedText>
                </ThemedView>
              )}

              {/* Type */}
              <ThemedText style={s.formLabel}>Type</ThemedText>
              <View style={s.typeRow}>
                <TouchableOpacity
                  style={[s.typeCard, bookingType === 'Instant' && s.typeCardSelected, { borderColor: theme.border, backgroundColor: bookingType === 'Instant' ? '#000000' : theme.backgroundElement }]}
                  onPress={() => setBookingType('Instant')}
                >
                  <SymbolView name="bolt.fill" size={24} tintColor={bookingType === 'Instant' ? '#ffffff' : theme.tint} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '600', marginTop: 6, color: bookingType === 'Instant' ? '#ffffff' : theme.text }}>
                    Instant walk
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, marginTop: 2, color: bookingType === 'Instant' ? 'rgba(255,255,255,0.7)' : theme.textSecondary, textAlign: 'center' }}>
                    30-45 min arrival
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.typeCard, bookingType === 'Scheduled' && s.typeCardSelected, { borderColor: theme.border, backgroundColor: bookingType === 'Scheduled' ? '#000000' : theme.backgroundElement }]}
                  onPress={() => setBookingType('Scheduled')}
                >
                  <SymbolView name="calendar" size={24} tintColor={bookingType === 'Scheduled' ? '#ffffff' : theme.tint} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '600', marginTop: 6, color: bookingType === 'Scheduled' ? '#ffffff' : theme.text }}>
                    Scheduled
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, marginTop: 2, color: bookingType === 'Scheduled' ? 'rgba(255,255,255,0.7)' : theme.textSecondary, textAlign: 'center' }}>
                    Pick a date & time
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {bookingType === 'Scheduled' && (
                <View style={[s.schedCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText style={{ fontWeight: '600', marginBottom: 12 }}>Schedule</ThemedText>
                  <View style={s.presetsRow}>
                    <TouchableOpacity style={[s.preset, { borderColor: theme.border }]} onPress={() => setPreset(2)}>
                      <ThemedText style={{ fontSize: 12, fontWeight: '600' }}>+2h</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.preset, { borderColor: theme.border }]} onPress={() => setPreset(4)}>
                      <ThemedText style={{ fontSize: 12, fontWeight: '600' }}>+4h</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.preset, { borderColor: theme.border }]} onPress={() => setPreset(24)}>
                      <ThemedText style={{ fontSize: 12, fontWeight: '600' }}>Tomorrow</ThemedText>
                    </TouchableOpacity>
                  </View>
                  <View style={[s.dash, { backgroundColor: theme.border, marginVertical: 10 }]} />
                  <View style={s.dateInputRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <ThemedText style={{ fontSize: 12, fontWeight: '600', marginBottom: 4 }}>Date</ThemedText>
                      <TextInput
                        style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.textSecondary}
                        value={scheduledDate}
                        onChangeText={setScheduledDate}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={{ fontSize: 12, fontWeight: '600', marginBottom: 4 }}>Time</ThemedText>
                      <TextInput
                        style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                        placeholder="HH:MM"
                        placeholderTextColor={theme.textSecondary}
                        value={scheduledTime}
                        onChangeText={setScheduledTime}
                      />
                    </View>
                  </View>
                </View>
              )}

              {errorMsg ? <ThemedText style={s.error}>{errorMsg}</ThemedText> : null}

              <TouchableOpacity
                style={[s.submitBtn, bookingLoading && s.disabled]}
                onPress={handleCreate}
                disabled={bookingLoading}
              >
                {bookingLoading ? <ActivityIndicator color="#ffffff" /> : <ThemedText style={{ color: '#ffffff', fontWeight: '700' }}>Confirm booking</ThemedText>}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, alignSelf: 'center', width: '100%' },
  scroll: { padding: Spacing.four, paddingBottom: BottomTabInset + Spacing.five, gap: Spacing.four },
  pageTitle: { fontSize: 26, fontWeight: '800', paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  toggleBar: { flexDirection: 'row', marginHorizontal: Spacing.four, borderRadius: 8, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 6, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '600' },
  center: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  retryBtn: { backgroundColor: '#000000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },

  // List
  bookingCard: { padding: 14, borderRadius: 10, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTopLeft: { flexDirection: 'row', alignItems: 'center' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  dash: { height: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },

  // New form
  formLabel: { fontSize: 18, fontWeight: '700' },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  petOption: { minWidth: 80, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  petOptionSelected: { borderColor: '#000000' },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeCard: { flex: 1, padding: 16, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeCardSelected: { borderColor: '#000000' },
  schedCard: { borderWidth: 1, borderRadius: 10, padding: 16 },
  presetsRow: { flexDirection: 'row', gap: 8 },
  preset: { flex: 1, height: 36, borderWidth: 1, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  dateInputRow: { flexDirection: 'row' },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 14 },
  error: { color: '#FF3B30', fontWeight: '600', fontSize: 13 },
  submitBtn: { height: 50, backgroundColor: '#000000', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  disabled: { opacity: 0.4 },
  successWrap: { alignItems: 'center', paddingVertical: 60 },
});
