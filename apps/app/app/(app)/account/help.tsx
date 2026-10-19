import { useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, sendEnquiry } from "@/lib/api";
import { SUPPORT_EMAIL, SUPPORT_HOURS } from "@/lib/catalog";
import { FAQS } from "@/lib/faqs";
import { colors, radius } from "@/theme";

export default function HelpScreen() {
  const { booking } = useLocalSearchParams<{ booking?: string }>();
  const { profile } = useAuth();
  const [open, setOpen] = useState<string | null>(null);
  const [message, setMessage] = useState(booking ? `About booking ${booking.slice(0, 8).toUpperCase()}: ` : "");

  const send = useMutation({
    mutationFn: () =>
      sendEnquiry({
        topic: booking ? "Booking" : "General",
        name: profile?.name ?? "PawMile customer",
        phoneNumber: profile?.phoneNumber?.replace(/^91/, ""),
        email: profile?.email ?? undefined,
        message: message.trim(),
      }),
  });

  return (
    <Screen header={<Header title="Help & support" />}>
      {/* Contact */}
      <Card style={styles.contact}>
        {send.isSuccess ? (
          <View style={styles.sent}>
            <View style={styles.sentIcon}>
              <Icon name="check" size={22} color={colors.paper} strokeWidth={2.6} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">Message sent</Text>
              <Text variant="bodySm" color={colors.textMuted}>
                We&apos;ll get back to you on your registered number.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Text variant="titleSm">Contact us</Text>
            <Text variant="bodySm" color={colors.textMuted} style={{ marginTop: 4, marginBottom: 14 }}>
              {SUPPORT_HOURS}
            </Text>
            <TextField
              placeholder="Describe the problem"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={2000}
            />
            {send.isError ? (
              <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 10 }}>
                {apiErrorMessage(send.error)}
              </Text>
            ) : null}
            <Button
              title="Send message"
              icon="chat"
              onPress={() => send.mutate()}
              loading={send.isPending}
              disabled={message.trim().length < 5}
              block
            />
            <Text variant="caption" color={colors.textSubtle} align="center" style={{ marginTop: 10 }}>
              Or email {SUPPORT_EMAIL}
            </Text>
          </>
        )}
      </Card>

      {/* FAQ */}
      {FAQS.map((group) => (
        <View key={group.title}>
          <Text variant="title" style={styles.groupTitle} accessibilityRole="header">
            {group.title}
          </Text>
          <Card padding={0}>
            {group.items.map((item, index) => {
              const expanded = open === item.q;
              return (
                <Pressable
                  key={item.q}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setOpen(expanded ? null : item.q);
                  }}
                  style={[styles.faq, index < group.items.length - 1 && styles.faqDivider]}
                >
                  <View style={styles.faqHead}>
                    <Text variant="bodyStrong" style={{ flex: 1 }}>
                      {item.q}
                    </Text>
                    <View style={[styles.toggle, expanded && styles.toggleOpen]}>
                      <Icon
                        name={expanded ? "minus" : "plus"}
                        size={16}
                        color={expanded ? colors.biscuit : colors.text}
                        strokeWidth={2.2}
                      />
                    </View>
                  </View>
                  {expanded ? (
                    <Text variant="bodySm" color={colors.textMuted} style={{ marginTop: 10 }}>
                      {item.a}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  contact: {
    marginTop: 8,
  },
  sent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  sentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.moss,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    marginTop: 26,
    marginBottom: 10,
  },
  faq: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  faqDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  faqHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggle: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOpen: {
    backgroundColor: colors.charcoal,
  },
});
