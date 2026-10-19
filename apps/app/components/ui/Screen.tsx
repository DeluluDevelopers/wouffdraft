import { useCallback, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { colors, GUTTER } from "@/theme";
import { ScrollIntoViewContext, useKeyboard } from "./keyboard";

// Space kept between a focused field and the top of the keyboard.
const KEYBOARD_GAP = 24;

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  background?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
};

// Page shell: safe area, optional sticky header/footer, keyboard-aware scroll.
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ["top", "left", "right"],
  background = colors.background,
  header,
  footer,
  contentStyle,
  refreshing,
  onRefresh,
}: Props) {
  const padding = padded ? { paddingHorizontal: GUTTER } : null;
  const keyboard = useKeyboard();
  const keyboardTop = useRef(0);
  keyboardTop.current = keyboard.visible ? keyboard.top : 0;
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);

  // Called by a focused field once the keyboard is up; reads refs so it is never stale.
  const scrollIntoView = useCallback((bottomInWindow: number) => {
    if (!keyboardTop.current) return;
    const visibleBottom = keyboardTop.current - KEYBOARD_GAP;
    if (bottomInWindow > visibleBottom) {
      scrollRef.current?.scrollTo({ y: offset.current + bottomInWindow - visibleBottom, animated: true });
    }
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={edges}>
      {header}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            onScroll={(e) => {
              offset.current = e.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={32}
            style={styles.flex}
            contentContainerStyle={[padding, styles.scrollContent, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.terracotta} />
              ) : undefined
            }
          >
            <ScrollIntoViewContext.Provider value={scrollIntoView}>{children}</ScrollIntoViewContext.Provider>
          </ScrollView>
        ) : (
          <View style={[styles.flex, padding, contentStyle]}>{children}</View>
        )}
        {/* The sticky action steps aside while typing so the form keeps its full height. */}
        {footer && !keyboard.visible ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
