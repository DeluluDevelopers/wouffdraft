import { useEffect, useRef, useState, type Ref } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import { searchAddress, type AddressPrediction } from "@/lib/api";
import { colors, radius } from "@/theme";
import { Chip } from "../ui/Chip";
import { Icon } from "../ui/Icon";
import { Text } from "../ui/Text";
import { TextField } from "../ui/TextField";

export type AddressChoice = { placeId: string; description: string; label: string };

const LABELS = ["Home", "Work", "Other"] as const;

// Google Places autocomplete via our API, plus a Home / Work / Other label.
export function AddressSearch({
  value,
  onChange,
  inputRef,
}: {
  value: AddressChoice | null;
  onChange: (choice: AddressChoice | null) => void;
  inputRef?: Ref<TextInput>;
}) {
  const [query, setQuery] = useState(value?.description ?? "");
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  const [labelKind, setLabelKind] = useState<(typeof LABELS)[number]>(
    value && !["Home", "Work"].includes(value.label) ? "Other" : ((value?.label as "Home" | "Work") ?? "Home"),
  );
  const [customLabel, setCustomLabel] = useState(value && !["Home", "Work"].includes(value.label) ? value.label : "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (value || query.trim().length < 3) {
      setPredictions([]);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSearching(true);
      setFailed(false);
      try {
        setPredictions(await searchAddress(query.trim()));
      } catch {
        setPredictions([]);
        setFailed(true);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer.current);
  }, [query, value]);

  const labelFor = (kind: (typeof LABELS)[number], custom = customLabel) =>
    kind === "Other" ? custom.trim() || "Other" : kind;

  return (
    <View>
      <TextField
        ref={inputRef}
        label="Address"
        returnKeyType="search"
        placeholder="Search your society, street or area"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (value) onChange(null);
        }}
        autoCorrect={false}
      />
      {searching ? <ActivityIndicator color={colors.terracotta} style={styles.spinner} /> : null}
      {failed ? (
        <Text variant="caption" color={colors.danger} style={styles.hint}>
          Address search failed. Check your connection and try again.
        </Text>
      ) : null}
      {predictions.length > 0 ? (
        <View style={styles.results}>
          {predictions.map((prediction, index) => (
            <Pressable
              key={prediction.placeId}
              accessibilityRole="button"
              onPress={() => {
                setQuery(prediction.description);
                setPredictions([]);
                onChange({
                  placeId: prediction.placeId,
                  description: prediction.description,
                  label: labelFor(labelKind),
                });
              }}
              style={({ pressed }) => [
                styles.result,
                index < predictions.length - 1 && styles.resultDivider,
                pressed && { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <Icon name="map-pin" size={18} color={colors.terracottaInk} />
              <Text variant="bodySm" style={{ flex: 1 }}>
                {prediction.description}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {value ? (
        <View style={styles.selected}>
          <Icon name="check-circle" size={20} color={colors.mossInk} />
          <Text variant="bodySm" style={{ flex: 1 }}>
            {value.description}
          </Text>
        </View>
      ) : null}

      <Text variant="label" color={colors.textMuted} style={styles.labelTitle}>
        Save as
      </Text>
      <View style={styles.labels}>
        {LABELS.map((kind) => (
          <Chip
            key={kind}
            label={kind}
            icon={kind === "Home" ? "home" : kind === "Work" ? "building" : "map-pin"}
            selected={labelKind === kind}
            onPress={() => {
              setLabelKind(kind);
              if (value) onChange({ ...value, label: labelFor(kind) });
            }}
          />
        ))}
      </View>
      {labelKind === "Other" ? (
        <TextField
          placeholder="e.g. Mum's place"
          returnKeyType="done"
          value={customLabel}
          onChangeText={(text) => {
            setCustomLabel(text);
            if (value) onChange({ ...value, label: labelFor("Other", text) });
          }}
          maxLength={30}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: -6,
    marginBottom: 12,
  },
  hint: {
    marginTop: -10,
    marginBottom: 12,
  },
  results: {
    marginTop: -8,
    marginBottom: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  resultDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  selected: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    marginTop: -6,
    marginBottom: 18,
    borderRadius: radius.md,
    backgroundColor: colors.mossSoft,
  },
  labelTitle: {
    marginBottom: 10,
  },
  labels: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
});
