import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Screen } from "@/ui/Screen";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { useProfileWizard } from "@/wizard/ProfileWizard";
import { searchAddress, type AddressPrediction } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

export default function AddressScreen() {
  const router = useRouter();
  const { data, setName, setAddress } = useProfileWizard();
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [selected, setSelected] = useState<AddressPrediction | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onSearch = (text: string) => {
    setQuery(text);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddress(text);
        setPredictions(results);
      } catch {
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const onSelect = (prediction: AddressPrediction) => {
    setQuery(prediction.description);
    setSelected(prediction);
    setPredictions([]);
  };

  const onNext = () => {
    if (!data.name.trim()) return;
    if (!selected) return;
    setAddress(selected.description, selected.placeId);
    router.push("/(onboarding)/completeProfile/pets");
  };

  const isValid = data.name.trim().length > 0 && selected !== null;

  return (
    <Screen scroll>
      <WizardStepHeader
        step={1}
        total={3}
        title="Your Info"
        subtitle="Tell us your name and where you're located."
      />

      <TextField
        label="Full name"
        placeholder="Your name"
        value={data.name}
        onChangeText={setName}
      />

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Search your address..."
          placeholderTextColor={Colors.light.outline}
          value={query}
          onChangeText={onSearch}
        />
        {searching && <Text style={styles.hint}>Searching...</Text>}
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.placeId}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.dropdownText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {selected && (
          <Text style={styles.selectedText}>{selected.description}</Text>
        )}
      </View>

      <PrimaryButton title="Next" onPress={onNext} disabled={!isValid} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    marginBottom: 20,
  },
  label: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
    fontFamily: Typography.labelCaps.fontFamily,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    color: Colors.light.ink,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Typography.bodyMd.fontFamily,
  },
  hint: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
    marginTop: 6,
    fontFamily: Typography.bodySm.fontFamily,
  },
  dropdown: {
    marginTop: 4,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  dropdownText: {
    color: Colors.light.ink,
    fontSize: 14,
    fontFamily: Typography.bodyMd.fontFamily,
  },
  selectedText: {
    color: Colors.light.primary,
    fontSize: 13,
    marginTop: 6,
    fontFamily: Typography.bodySm.fontFamily,
  },
});
