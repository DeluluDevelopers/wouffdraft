import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Props = {
  icon?: IconName;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Says what's missing and offers the one action that fills it.
export function EmptyState({ icon = "paw", title, text, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Icon name={icon} size={28} color={colors.terracottaInk} />
      </View>
      <Text variant="title" align="center">
        {title}
      </Text>
      {text ? (
        <Text variant="bodySm" color={colors.textMuted} align="center" style={styles.text}>
          {text}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 12,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  text: {
    marginTop: 6,
    maxWidth: 300,
  },
  action: {
    marginTop: 20,
    alignSelf: "center",
  },
});
