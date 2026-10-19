import { Pressable, StyleSheet, View } from "react-native";
import { isSlotAvailable, slotGroups, type Slot } from "@/lib/slots";
import { colors, radius } from "@/theme";
import { Icon, type IconName } from "../ui/Icon";
import { Text } from "../ui/Text";

const GROUP_ICONS: Record<string, IconName> = { Morning: "sun", Afternoon: "sun", Evening: "moon" };

type Props = {
  dateKey: string | null;
  selected: string | null;
  onSelect: (slot: Slot) => void;
};

// Half-hour slots; anything inside the 2-hour booking lead time is disabled.
export function SlotGrid({ dateKey, selected, onSelect }: Props) {
  const groups = slotGroups()
    .map((group) => ({
      ...group,
      slots: dateKey ? group.slots.filter((slot) => isSlotAvailable(dateKey, slot)) : group.slots,
    }))
    .filter((group) => group.slots.length > 0);

  if (groups.length === 0) {
    return (
      <Text variant="bodySm" color={colors.textMuted}>
        No times left on this day. Choose another day.
      </Text>
    );
  }

  return (
    <View style={{ gap: 18 }}>
      {groups.map((group) => {
        return (
          <View key={group.title}>
            <View style={styles.groupHead}>
              <Icon name={GROUP_ICONS[group.title]!} size={16} color={colors.textMuted} />
              <Text variant="label" color={colors.textMuted}>
                {group.title}
              </Text>
            </View>
            <View style={styles.grid}>
              {group.slots.map((slot) => {
                const active = selected === slot.key;
                return (
                  <Pressable
                    key={slot.key}
                    onPress={() => onSelect(slot)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.slot, active && styles.slotActive]}
                  >
                    <Text variant="bodySm" color={active ? colors.biscuit : colors.text} style={styles.slotText}>
                      {slot.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slot: {
    width: "31.5%",
    flexGrow: 0,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  slotActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  slotText: {
    fontFamily: "Archivo-SemiBold",
  },
});
