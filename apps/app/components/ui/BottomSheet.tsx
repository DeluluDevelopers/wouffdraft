import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, GUTTER, radius } from "@/theme";
import { Text } from "./Text";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeightRatio?: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function BottomSheet({ visible, onClose, title, subtitle, children, maxHeightRatio = 0.9 }: Props) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 220 }).start();
    } else if (mounted) {
      Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > 6,
      onPanResponderMove: (_e, g) => {
        if (g.dy > 0) slide.setValue(1 - g.dy / SCREEN_HEIGHT);
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy > 90) onClose();
        else Animated.spring(slide, { toValue: 1, useNativeDriver: true }).start();
      },
    }),
  ).current;

  if (!mounted) return null;

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT, 0], extrapolate: "clamp" });
  const opacity = slide.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.anchor}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: SCREEN_HEIGHT * maxHeightRatio,
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{ translateY }],
            },
          ]}
        >
          <View {...pan.panHandlers} style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          {title ? (
            <View style={styles.head}>
              <Text variant="title">{title}</Text>
              {subtitle ? (
                <Text variant="bodySm" color={colors.textMuted} style={{ marginTop: 4 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.overlay,
  },
  anchor: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handleRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.lineStrong,
  },
  head: {
    paddingHorizontal: GUTTER,
    paddingBottom: 12,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingBottom: 8,
  },
});
