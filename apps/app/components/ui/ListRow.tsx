import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Props = {
  icon?: IconName;
  iconTone?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
  right?: React.ReactNode;
};

export function ListRow({
  icon,
  iconTone = colors.surfaceMuted,
  title,
  subtitle,
  value,
  onPress,
  danger,
  last,
  right,
}: Props) {
  const content = (
    <View style={[styles.row, !last && styles.divider]}>
      {icon ? (
        <View style={[styles.icon, { backgroundColor: iconTone }]}>
          <Icon name={icon} size={19} color={danger ? colors.danger : colors.text} />
        </View>
      ) : null}
      <View style={styles.text}>
        <Text variant="bodyStrong" color={danger ? colors.danger : colors.text}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color={colors.textMuted} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="bodySm" color={colors.textMuted} style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {right}
      {onPress && !right ? <Icon name="chevron-right" size={18} color={colors.textSubtle} /> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.6 }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  value: {
    maxWidth: 140,
  },
});
