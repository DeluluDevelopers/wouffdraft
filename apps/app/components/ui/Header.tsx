import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, GUTTER } from "@/theme";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showBack?: boolean;
};

export function Header({ title, onBack, right, showBack = true }: Props) {
  const router = useRouter();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/home")));
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {showBack ? <IconButton icon="arrow-left" label="Go back" onPress={back} /> : null}
      </View>
      {title ? (
        <Text variant="titleSm" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GUTTER,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: colors.background,
  },
  side: {
    width: 44,
  },
  right: {
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
});
