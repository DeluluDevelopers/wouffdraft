import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
  Dimensions,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth, PetInfo } from '@/context/auth-context';
import { apiFetch } from '@/services/api';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    user,
    isAuthenticated,
    profileStatus,
    sendOtp,
    verifyOtp,
    completeProfile,
    logout,
  } = useAuth();

  // Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Onboarding State
  const [profileName, setProfileName] = useState('');
  const [locationLabel, setLocationLabel] = useState('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [predictions, setPredictions] = useState<{ description: string; placeId: string }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<{ description: string; placeId: string } | null>(null);
  const [onboardPets, setOnboardPets] = useState<Omit<PetInfo, 'id'>[]>([]);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState<'Male' | 'Female'>('Male');
  const [petVaccine, setPetVaccine] = useState<'UpToDate' | 'Partial' | 'None'>('UpToDate');
  const [petMedicalCondition, setPetMedicalCondition] = useState(false);
  const [petMedicalHistory, setPetMedicalHistory] = useState('');
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardError, setOnboardError] = useState('');

  const otpInputRef = useRef<RNTextInput>(null);

  // OTP Resend Timer
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Address Autocomplete
  useEffect(() => {
    if (addressSearch.trim().length > 2 && (!selectedAddress || addressSearch !== selectedAddress.description)) {
      const fetchPredictions = async () => {
        try {
          const res = await apiFetch(`/address/autocomplete?input=${encodeURIComponent(addressSearch)}`, {
            skipAuth: true,
          });
          if (res.predictions) setPredictions(res.predictions);
        } catch (err) {
          console.error('Failed address lookup', err);
        }
      };
      const delay = setTimeout(fetchPredictions, 300);
      return () => clearTimeout(delay);
    } else if (addressSearch.trim().length <= 2) {
      setPredictions([]);
    }
  }, [addressSearch, selectedAddress]);

  // Auto-advance to OTP step when OTP sent successfully
  // Focus OTP input when step changes to otp
  useEffect(() => {
    if (authStep === 'otp') {
      setTimeout(() => otpInputRef.current?.focus(), 300);
    }
  }, [authStep]);

  // ==================== AUTH ====================
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Enter a valid 10-digit phone number');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    const cleanPhone = `91${phoneNumber}`;
    const res = await sendOtp(cleanPhone);
    setAuthLoading(false);
    if (res.success) {
      setAuthStep('otp');
      setResendTimer(60);
    } else {
      setAuthError(res.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setAuthError('Enter the 6-digit code');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    const cleanPhone = `91${phoneNumber}`;
    const res = await verifyOtp(cleanPhone, otp);
    setAuthLoading(false);
    if (!res.success) setAuthError(res.message);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setAuthError('');
    const cleanPhone = `91${phoneNumber}`;
    const res = await sendOtp(cleanPhone);
    if (res.success) {
      setResendTimer(60);
    } else {
      setAuthError(res.message);
    }
  };

  // ==================== ONBOARDING ====================
  const handleAddPet = () => {
    if (!petName.trim()) {
      setOnboardError('Pet name is required');
      return;
    }
    const ageNum = parseInt(petAge);
    if (isNaN(ageNum) || ageNum <= 0) {
      setOnboardError('Enter a valid age in months');
      return;
    }
    const newPet: Omit<PetInfo, 'id'> = {
      name: petName.trim(),
      species: petSpecies,
      breed: petBreed.trim() || undefined,
      ageMonths: ageNum,
      gender: petGender,
      vaccinationStatus: petVaccine,
      medicalConditions: petMedicalCondition,
      medicalHistory: petMedicalHistory.trim() || undefined,
    };
    setOnboardPets((prev) => [...prev, newPet]);
    setPetName('');
    setPetBreed('');
    setPetAge('');
    setPetMedicalCondition(false);
    setPetMedicalHistory('');
    setShowAddPetForm(false);
    setOnboardError('');
  };

  const handleRemovePet = (index: number) => {
    setOnboardPets((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCompleteProfile = async () => {
    if (!profileName.trim()) { setOnboardError('Full name is required'); return; }
    if (!selectedAddress) { setOnboardError('Search and select your address'); return; }
    if (onboardPets.length === 0) { setOnboardError('Add at least one pet'); return; }
    setOnboardLoading(true);
    setOnboardError('');
    const finalLabel = locationLabel === 'Other' ? customLabel || 'Other' : locationLabel;
    const res = await completeProfile(profileName.trim(), finalLabel, selectedAddress.placeId, onboardPets);
    setOnboardLoading(false);
    if (!res.success) setOnboardError(res.message);
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={s.flex}>
        <SafeAreaView style={s.safeArea}>
          <ScrollView contentContainerStyle={s.centerScroll} keyboardShouldPersistTaps="handled" bounces={false}>
            <View style={s.authCard}>
              <View style={s.logoWrap}>
                <SymbolView name="pawprint.fill" size={48} tintColor={theme.text} />
                <ThemedText style={s.logoText}>Woff</ThemedText>
              </View>

              {authStep === 'phone' ? (
                <>
                  <ThemedText style={s.authTitle}>Get started</ThemedText>
                  <ThemedText themeColor="textSecondary" style={s.authSubtitle}>
                    Enter your mobile number to sign in or create an account.
                  </ThemedText>

                  <View style={s.phoneRow}>
                    <View style={[s.prefixBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                      <ThemedText>91</ThemedText>
                    </View>
                    <TextInput
                      ref={otpInputRef}
                      style={[s.phoneInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                      placeholder="Enter mobile number"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={(v) => { setPhoneNumber(v.replace(/[^0-9]/g, '')); setAuthError(''); }}
                    />
                  </View>

                  {authError ? <ThemedText style={s.errorText}>{authError}</ThemedText> : null}

                  <TouchableOpacity
                    style={[s.primaryBtn, authLoading && s.disabled]}
                    onPress={handleSendOtp}
                    disabled={authLoading}
                  >
                    {authLoading ? <ActivityIndicator color={theme.background} /> : <ThemedText style={s.btnText}>Send OTP</ThemedText>}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={s.backRow} onPress={() => { setAuthStep('phone'); setOtp(''); setAuthError(''); }}>
                    <SymbolView name="chevron.left" size={14} tintColor={theme.tint} />
                    <ThemedText style={s.backText}>Change</ThemedText>
                  </TouchableOpacity>

                  <ThemedText style={s.authTitle}>Enter code</ThemedText>
                  <ThemedText themeColor="textSecondary" style={s.authSubtitle}>
                    Sent to 91 {phoneNumber}
                  </ThemedText>

                  <TextInput
                    ref={otpInputRef}
                    style={[s.otpInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                    placeholder="000000"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    maxLength={6}
                    textAlign="center"
                    value={otp}
                    onChangeText={(v) => { setOtp(v.replace(/[^0-9]/g, '')); setAuthError(''); }}
                  />

                  {authError ? <ThemedText style={s.errorText}>{authError}</ThemedText> : null}

                  <TouchableOpacity
                    style={[s.primaryBtn, authLoading && s.disabled]}
                    onPress={handleVerifyOtp}
                    disabled={authLoading}
                  >
                    {authLoading ? <ActivityIndicator color={theme.background} /> : <ThemedText style={s.btnText}>Verify & Log In</ThemedText>}
                  </TouchableOpacity>

                  <TouchableOpacity style={s.resendBtn} onPress={handleResendOtp} disabled={resendTimer > 0}>
                    <ThemedText themeColor="textSecondary" style={{ fontWeight: '600' }}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isAuthenticated && profileStatus !== 'PROFILE_COMPLETED') {
    return (
      <ThemedView style={s.flex}>
        <SafeAreaView style={s.safeArea}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <View style={s.onboardHeader}>
              <View>
                <ThemedText style={s.pageTitle}>Complete profile</ThemedText>
                <ThemedText themeColor="textSecondary" style={s.pageSub}>
                  Tell us about you and your pets.
                </ThemedText>
              </View>
              <TouchableOpacity onPress={logout}>
                <SymbolView name="power" size={20} tintColor={theme.tint} />
              </TouchableOpacity>
            </View>

            {/* Section 1: Your Details */}
            <ThemedText style={s.sectionTitle}>Your details</ThemedText>

            <ThemedText style={s.label}>Full name</ThemedText>
            <TextInput
              style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
              placeholder="John Doe"
              placeholderTextColor={theme.textSecondary}
              value={profileName}
              onChangeText={(v) => { setProfileName(v); setOnboardError(''); }}
            />

            <ThemedText style={s.label}>Address</ThemedText>
            <TextInput
              style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
              placeholder="Search your location..."
              placeholderTextColor={theme.textSecondary}
              value={addressSearch}
              onChangeText={(v) => { setAddressSearch(v); if (selectedAddress && v !== selectedAddress.description) setSelectedAddress(null); setOnboardError(''); }}
            />

            {predictions.length > 0 && !selectedAddress ? (
              <View style={[s.predictions, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                {predictions.map((item, idx) => (
                  <TouchableOpacity
                    key={item.placeId + idx}
                    style={[s.predictionItem, { borderBottomColor: theme.border }]}
                    onPress={() => { setSelectedAddress(item); setAddressSearch(item.description); setPredictions([]); }}
                  >
                    <SymbolView name="mappin.and.ellipse" size={14} tintColor={theme.tint} style={{ marginRight: 8 }} />
                    <ThemedText numberOfLines={1} style={{ flex: 1 }}>{item.description}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {selectedAddress ? (
              <View style={s.addressSetRow}>
                <SymbolView name="checkmark.circle.fill" size={16} tintColor={theme.tint} style={{ marginRight: 6 }} />
                <ThemedText style={{ flex: 1, fontSize: 13 }}>Address set: {selectedAddress.description}</ThemedText>
              </View>
            ) : null}

            <ThemedText style={s.label}>Label</ThemedText>
            <View style={s.labelRow}>
              {['Home', 'Office', 'Other'].map((lbl) => (
                <TouchableOpacity
                  key={lbl}
                  style={[s.segment, locationLabel === lbl && s.segmentActive, { borderColor: theme.border }]}
                  onPress={() => setLocationLabel(lbl)}
                >
                  <ThemedText style={[s.segmentText, locationLabel === lbl && s.segmentTextActive]}>
                    {lbl}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            {locationLabel === 'Other' && (
              <TextInput
                style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                placeholder="Custom label"
                placeholderTextColor={theme.textSecondary}
                value={customLabel}
                onChangeText={setCustomLabel}
              />
            )}

            {/* Divider */}
            <View style={[s.divider, { backgroundColor: theme.border }]} />

            {/* Section 2: Pets */}
            <View style={s.petsHeader}>
              <ThemedText style={s.sectionTitle}>Pets ({onboardPets.length})</ThemedText>
              {!showAddPetForm && (
                <TouchableOpacity style={s.addPetBtn} onPress={() => setShowAddPetForm(true)}>
                  <SymbolView name="plus" size={12} tintColor={theme.background} style={{ marginRight: 4 }} />
                  <ThemedText style={s.addPetBtnText}>Add pet</ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {onboardPets.map((pet, idx) => (
              <View key={idx} style={[s.petCard, { backgroundColor: theme.backgroundElement }]}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontWeight: '600' }}>{pet.name}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }}>
                    {pet.species} · {pet.breed || 'Unknown'} · {pet.ageMonths}mo
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => handleRemovePet(idx)}>
                  <SymbolView name="trash" size={16} tintColor={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={{ height: 8 }} />

            {showAddPetForm && (
              <View style={[s.petForm, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <View style={s.petFormHeader}>
                  <ThemedText style={{ fontWeight: '600' }}>New pet</ThemedText>
                  <TouchableOpacity onPress={() => { setShowAddPetForm(false); setOnboardError(''); }}>
                    <SymbolView name="xmark" size={16} tintColor={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ThemedText style={s.label}>Name *</ThemedText>
                <TextInput
                  style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  placeholder="Buddy"
                  placeholderTextColor={theme.textSecondary}
                  value={petName}
                  onChangeText={setPetName}
                />

                <ThemedText style={s.label}>Species *</ThemedText>
                <View style={s.labelRow}>
                  {(['Dog', 'Cat'] as const).map((sp) => (
                    <TouchableOpacity
                      key={sp}
                      style={[s.segment, petSpecies === sp && s.segmentActive, { borderColor: theme.border, flex: 1 }]}
                      onPress={() => setPetSpecies(sp)}
                    >
                      <ThemedText style={[s.segmentText, petSpecies === sp && s.segmentTextActive]}>{sp}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>

                <ThemedText style={s.label}>Breed</ThemedText>
                <TextInput
                  style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  placeholder="Golden Retriever / Persian"
                  placeholderTextColor={theme.textSecondary}
                  value={petBreed}
                  onChangeText={setPetBreed}
                />

                <View style={s.rowHalf}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <ThemedText style={s.label}>Age (months) *</ThemedText>
                    <TextInput
                      style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                      placeholder="12"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="numeric"
                      value={petAge}
                      onChangeText={(v) => setPetAge(v.replace(/[^0-9]/g, ''))}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={s.label}>Gender *</ThemedText>
                    <View style={s.labelRow}>
                      {(['Male', 'Female'] as const).map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={[s.segment, petGender === g && s.segmentActive, { borderColor: theme.border, flex: 1 }]}
                          onPress={() => setPetGender(g)}
                        >
                          <ThemedText style={[s.segmentText, petGender === g && s.segmentTextActive]}>{g}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <ThemedText style={s.label}>Vaccination</ThemedText>
                <View style={s.labelRow}>
                  {(['UpToDate', 'Partial', 'None'] as const).map((vac) => (
                    <TouchableOpacity
                      key={vac}
                      style={[s.segment, petVaccine === vac && s.segmentActive, { borderColor: theme.border, flex: 1 }]}
                      onPress={() => setPetVaccine(vac)}
                    >
                      <ThemedText style={[s.segmentText, petVaccine === vac && s.segmentTextActive]}>
                        {vac === 'UpToDate' ? 'Up to date' : vac}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={s.switchRow}>
                  <ThemedText>Medical conditions?</ThemedText>
                  <Switch
                    value={petMedicalCondition}
                    onValueChange={setPetMedicalCondition}
                    trackColor={{ false: theme.border, true: theme.text }}
                    thumbColor={theme.background}
                  />
                </View>

                {petMedicalCondition && (
                  <TextInput
                    style={[s.inputArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                    placeholder="Describe conditions, allergies, medications..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={3}
                    value={petMedicalHistory}
                    onChangeText={setPetMedicalHistory}
                  />
                )}

                <TouchableOpacity style={s.submitPetBtn} onPress={handleAddPet}>
                  <ThemedText style={s.submitBtnText}>Add pet</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {onboardError ? <ThemedText style={s.errorText}>{onboardError}</ThemedText> : null}

            <TouchableOpacity
              style={[s.completeBtn, onboardLoading && s.disabled]}
              onPress={handleCompleteProfile}
              disabled={onboardLoading}
            >
              {onboardLoading ? <ActivityIndicator color={theme.background} /> : <ThemedText style={s.submitBtnText}>Complete registration</ThemedText>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // ==================== DASHBOARD ====================
  return (
    <ThemedView style={s.flex}>
      <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={s.scroll}>
          {/* Header */}
          <View style={s.dashHeader}>
            <View>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 14 }}>Welcome back,</ThemedText>
              <ThemedText style={s.dashName}>{user?.name}</ThemedText>
            </View>
            <SymbolView name="person.crop.circle.fill" size={40} tintColor={theme.tint} />
          </View>

          {/* Location */}
          <View style={[s.locationBar, { backgroundColor: theme.backgroundElement }]}>
            <SymbolView name="mappin.circle.fill" size={18} tintColor={theme.tint} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600', fontSize: 14 }}>
                {user?.location?.[0]?.label || 'Location'}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }} numberOfLines={1}>
                {user?.location?.[0]?.address || 'No address set'}
              </ThemedText>
            </View>
          </View>

          {/* Pets */}
          <ThemedText style={s.secTitle}>Your pets</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.petScroll}>
            {user?.pets?.map((pet) => (
              <View key={pet.id} style={[s.petCardDash, { backgroundColor: theme.backgroundElement }]}>
                <SymbolView name={pet.species === 'Dog' ? 'dog.fill' : 'cat.fill'} size={24} tintColor={theme.tint} />
                <ThemedText style={{ fontWeight: '600', marginTop: 8 }}>{pet.name}</ThemedText>
                <ThemedText themeColor="textSecondary" style={{ fontSize: 12 }}>{pet.breed || pet.species}</ThemedText>
                <View style={[s.ageBadge, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={{ fontSize: 11 }}>{pet.ageMonths}mo</ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Services */}
          <ThemedText style={s.secTitle}>Request care</ThemedText>
          <View style={s.serviceGrid}>
            <TouchableOpacity
              style={[s.serviceCard, { backgroundColor: theme.backgroundElement }]}
              onPress={() => router.push('/bookings')}
            >
              <SymbolView name="bolt.fill" size={28} tintColor={theme.tint} />
              <ThemedText style={{ fontWeight: '600', marginTop: 8 }}>Instant</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 12, textAlign: 'center' }}>
                On-demand walk, 30-45 min
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.serviceCard, { backgroundColor: theme.backgroundElement }]}
              onPress={() => router.push('/bookings')}
            >
              <SymbolView name="calendar" size={28} tintColor={theme.tint} />
              <ThemedText style={{ fontWeight: '600', marginTop: 8 }}>Scheduled</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 12, textAlign: 'center' }}>
                Plan a future date & time
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Info banner */}
          <View style={[s.infoBanner, { backgroundColor: theme.backgroundElement }]}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600', fontSize: 16 }}>Verified caregivers</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ fontSize: 13, marginTop: 4 }}>
                All caregivers are background-checked and highly rated.
              </ThemedText>
            </View>
            <SymbolView name="checkmark.seal.fill" size={36} tintColor={theme.tint} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, alignSelf: 'center', width: '100%' },
  scroll: { padding: Spacing.four, paddingBottom: BottomTabInset + Spacing.five, gap: Spacing.four },
  centerScroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.four },

  // Auth
  authCard: { maxWidth: 380, width: '100%', alignSelf: 'center', gap: Spacing.three },
  logoWrap: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.four },
  logoText: { fontSize: 36, fontWeight: '800' },
  authTitle: { fontSize: 24, fontWeight: '700' },
  authSubtitle: { fontSize: 14, lineHeight: 20 },
  phoneRow: { flexDirection: 'row', height: 52, gap: 0 },
  prefixBox: { width: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRightWidth: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  phoneInput: { flex: 1, paddingHorizontal: 16, borderWidth: 1, borderTopRightRadius: 10, borderBottomRightRadius: 10, fontSize: 16 },
  otpInput: { height: 56, borderWidth: 1, borderRadius: 10, fontSize: 24, fontWeight: '700', letterSpacing: 10, paddingHorizontal: 16 },
  primaryBtn: { height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.4 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontWeight: '600' },
  resendBtn: { alignItems: 'center', padding: 8 },
  errorText: { color: '#FF3B30', fontWeight: '600', fontSize: 13 },

  // Onboarding
  onboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: 26, fontWeight: '800' },
  pageSub: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  input: { height: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, fontSize: 15 },
  predictions: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  predictionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 14, borderBottomWidth: 1 },
  addressSetRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.04)' },
  labelRow: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, height: 40, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  segmentActive: { backgroundColor: '#000000' },
  segmentText: { fontSize: 13, fontWeight: '600' },
  segmentTextActive: { color: '#ffffff' },
  divider: { height: 1, marginVertical: 4 },
  petsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addPetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000000', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  addPetBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  petCard: { flexDirection: 'row', padding: 14, borderRadius: 8, alignItems: 'center' },
  petForm: { borderWidth: 1, borderRadius: 10, padding: 16, gap: 8 },
  petFormHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rowHalf: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  inputArea: { height: 72, borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14, textAlignVertical: 'top' },
  submitPetBtn: { height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', marginTop: 4 },
  submitBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  completeBtn: { height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' },

  // Dashboard
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dashName: { fontSize: 26, fontWeight: '800' },
  locationBar: { flexDirection: 'row', padding: 14, borderRadius: 10, alignItems: 'center' },
  secTitle: { fontSize: 18, fontWeight: '700' },
  petScroll: { gap: 12, paddingRight: 20 },
  petCardDash: { width: 130, padding: 14, borderRadius: 10, gap: 4 },
  ageBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  serviceGrid: { flexDirection: 'row', gap: 12 },
  serviceCard: { flex: 1, padding: 18, borderRadius: 10, alignItems: 'center' },
  infoBanner: { flexDirection: 'row', padding: 18, borderRadius: 10, alignItems: 'center', gap: 12 },
});
