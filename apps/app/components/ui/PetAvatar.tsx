import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

const TONES = [colors.honey, colors.sage, colors.blush, colors.moss];

function toneFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length]!;
}

// Initial on a stable accent colour, with a small species badge.
export function PetAvatar({ name, species, size = 52 }: { name: string; species: "Dog" | "Cat"; size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: toneFor(name) }]}
      >
        <Text variant="title" style={{ fontSize: size * 0.4, lineHeight: size * 0.5 }}>
          {name.trim().charAt(0).toUpperCase() || "?"}
        </Text>
      </View>
      <View style={[styles.badge, { width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21 }]}>
        <Icon name={species === "Cat" ? "cat" : "dog"} size={size * 0.26} color={colors.charcoal} strokeWidth={2} />
      </View>
    </View>
  );
}

export function PersonAvatar({
  name,
  size = 48,
  tone = colors.charcoal,
}: {
  name?: string | null;
  size?: number;
  tone?: string;
}) {
  const initials = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: tone }]}>
      {initials ? (
        <Text variant="titleSm" color={colors.biscuit} style={{ fontSize: size * 0.36, lineHeight: size * 0.44 }}>
          {initials}
        </Text>
      ) : (
        <Icon name="user" size={size * 0.5} color={colors.biscuit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
});
