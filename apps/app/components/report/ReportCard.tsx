import { Image, StyleSheet, View } from "react-native";
import type { VisitReport } from "@/lib/api";
import { km } from "@/lib/format";
import { colors, radius } from "@/theme";
import { Icon, type IconName } from "../ui/Icon";
import { Text } from "../ui/Text";
import { RouteMap } from "./RouteMap";

const MOOD: Record<VisitReport["mood"], string> = {
  Happy: "Happy",
  Calm: "Calm",
  Energetic: "Energetic",
  Anxious: "Anxious",
};

function minutesBetween(a: string | null, b: string | null) {
  if (!a || !b) return null;
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000));
}

export function ReportCard({
  report,
  petName,
  walkerName,
  title = "Walk report",
}: {
  report: VisitReport;
  petName: string;
  walkerName?: string | null;
  title?: string;
}) {
  const minutes = minutesBetween(report.startedAt, report.endedAt);
  const checks: { label: string; icon: IconName; done: boolean }[] = [
    { label: "Pee", icon: "droplet", done: report.pee },
    { label: "Poo", icon: "check", done: report.poo },
    { label: "Water", icon: "bowl", done: report.water },
    { label: "Fed", icon: "heart", done: report.fed },
  ];

  return (
    <View style={styles.card}>
      <Text variant="label" color={colors.terracottaInk}>
        {title}
      </Text>
      <View style={styles.headline}>
        <Text variant="title">{petName}</Text>
        <Text variant="bodySm" color={colors.textMuted}>
          Mood: {MOOD[report.mood]}
        </Text>
      </View>

      {report.route && report.route.length > 1 ? <RouteMap route={report.route} style={styles.map} /> : null}

      <View style={styles.stats}>
        {report.distanceMeters != null ? (
          <View style={styles.stat}>
            <Text variant="price">
              {km(report.distanceMeters)}
              <Text variant="bodySm" color={colors.textMuted}>
                {" "}
                km
              </Text>
            </Text>
            <Text variant="caption" color={colors.textSubtle}>
              Distance
            </Text>
          </View>
        ) : null}
        {minutes != null ? (
          <View style={styles.stat}>
            <Text variant="price">
              {minutes}
              <Text variant="bodySm" color={colors.textMuted}>
                {" "}
                min
              </Text>
            </Text>
            <Text variant="caption" color={colors.textSubtle}>
              Time out
            </Text>
          </View>
        ) : null}
        {report.photoUrl ? (
          <Image
            source={{ uri: report.photoUrl }}
            style={styles.photo}
            accessibilityLabel={`${petName} during the visit`}
          />
        ) : null}
      </View>

      <View style={styles.checks}>
        {checks.map((check) => (
          <View key={check.label} style={[styles.check, check.done ? styles.checkDone : styles.checkNot]}>
            <View style={[styles.checkDot, { backgroundColor: check.done ? colors.moss : colors.biscuit3 }]}>
              <Icon
                name={check.done ? "check" : "minus"}
                size={11}
                color={check.done ? colors.paper : colors.textSubtle}
                strokeWidth={3}
              />
            </View>
            <Text variant="caption" color={check.done ? "#3C4A28" : colors.textSubtle} style={styles.checkText}>
              {check.label}
            </Text>
          </View>
        ))}
      </View>

      {report.note ? (
        <View style={styles.note}>
          <Text variant="bodySm">{report.note}</Text>
          {walkerName ? (
            <Text variant="caption" color={colors.textMuted} style={{ marginTop: 6 }}>
              {walkerName}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 12,
  },
  headline: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    columnGap: 8,
    marginTop: -4,
  },
  map: {
    marginTop: 2,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  stat: {
    flex: 1,
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    gap: 2,
  },
  photo: {
    width: 76,
    borderRadius: radius.sm,
    backgroundColor: colors.biscuit3,
  },
  checks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  check: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  checkDone: {
    backgroundColor: colors.mossSoft,
  },
  checkNot: {
    backgroundColor: colors.surfaceMuted,
  },
  checkDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontFamily: "Archivo-SemiBold",
  },
  note: {
    padding: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.honeySoft,
  },
});
