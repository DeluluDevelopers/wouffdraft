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
import { useProfileWizard } from "@/wizard/ProfileWizard";
import { searchAddress, type AddressPrediction } from "@/lib/api";

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
    <Screen>
      <View style={styles.card}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>Your info</Text>
        <Text style={styles.subtitle}>
          Tell us your name and where you're located.
        </Text>

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
            placeholderTextColor="#777"
            value={query}
            onChangeText={onSearch}
          />
          {searching && (
            <Text style={styles.hint}>Searching...</Text>
          )}
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

        <PrimaryButton
          title="Next"
          onPress={onNext}
          disabled={!isValid}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#21212A",
  },
  step: {
    color: "#8B8B96",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    color: "#D7D7DD",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#24242B",
    backgroundColor: "#121218",
    color: "#FFF",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    color: "#777",
    fontSize: 12,
    marginTop: 6,
  },
  dropdown: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#24242B",
    backgroundColor: "#121218",
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#24242B",
  },
  dropdownText: {
    color: "#FFF",
    fontSize: 14,
  },
  selectedText: {
    color: "#4ADE80",
    fontSize: 13,
    marginTop: 6,
  },
});
