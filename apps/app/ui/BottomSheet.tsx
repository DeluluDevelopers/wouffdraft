import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeightRatio?: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  maxHeightRatio = 0.88,
}: Props) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) {
          slideAnim.setValue(1 - gesture.dy / SCREEN_HEIGHT);
        }
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dy > 90) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!mounted) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
    extrapolate: "clamp",
  });
  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdropWrap} onPress={onClose}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        />
      </Pressable>
      <Animated.View
        style={[
          styles.sheet,
          { maxHeight: SCREEN_HEIGHT * maxHeightRatio, transform: [{ translateY }] },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View {...panResponder.panHandlers} style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          {!!title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.content}>{children}</View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropWrap: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: Colors.light.ink,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.light.outlineVariant,
  },
  handleRow: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.outlineVariant,
  },
  title: {
    fontFamily: Fonts.labelExtraBold,
    fontSize: 20,
    color: Colors.light.ink,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
