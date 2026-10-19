import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { BookingActionSheet } from "@/components/bookings/BookingActionSheet";
import { ReportCard } from "@/components/report/ReportCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ListRow } from "@/components/ui/ListRow";
import { PersonAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { StatusPill } from "@/components/ui/StatusPill";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, reviewBooking, type Booking } from "@/lib/api";
import { categoryFor, serviceLabel } from "@/lib/catalog";
import { duration, rupees, shortDate, whenLabel } from "@/lib/format";
import { isActive, useBooking } from "@/lib/queries";
import { colors, radius } from "@/theme";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const { data: booking, isLoading, refetch, isRefetching } = useBooking(id);
  const [managing, setManaging] = useState(false);

  const onUpdated = (updated: Booking) => {
    queryClient.setQueryData(["booking", id], updated);
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    if (updated.groupId) queryClient.invalidateQueries({ queryKey: ["booking-group", updated.groupId] });
  };

  if (isLoading) {
    return (
      <Screen header={<Header title="Booking" />}>
        <View style={{ gap: 14 }}>
          <Skeleton height={130} />
          <Skeleton height={180} />
          <Skeleton height={120} />
        </View>
      </Screen>
    );
  }

  if (!booking) {
    return (
      <Screen header={<Header title="Booking" />}>
        <EmptyState
          icon="calendar"
          title="Booking not found"
          text="It may have been removed."
          actionLabel="Go to bookings"
          onAction={() => router.replace("/bookings")}
        />
      </Screen>
    );
  }

  const category = categoryFor(booking.service);
  const active = isActive(booking);

  return (
    <Screen
      header={<Header title="Booking" />}
      refreshing={isRefetching}
      onRefresh={refetch}
      footer={
        active ? (
          <Button
            title="Manage booking"
            variant="outline"
            icon="edit"
            onPress={() => setManaging(true)}
            block
            size="lg"
          />
        ) : undefined
      }
    >
      {/* Summary */}
      <View style={styles.summary}>
        <View style={[styles.serviceIcon, { backgroundColor: category.tone }]}>
          <Icon name={category.icon} size={26} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <StatusPill status={booking.status} />
          <Text variant="titleLg">{serviceLabel(booking.service)}</Text>
          <Text variant="bodyStrong">{whenLabel(booking.scheduledAt, booking.type)}</Text>
          <Text variant="bodySm" color={colors.textMuted}>
            {[booking.pet?.name, duration(booking.durationMinutes), rupees(booking.priceInRupees)]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </View>
      </View>

      <Timeline booking={booking} />

      {/* Walker */}
      {booking.walker ? (
        <Card style={styles.block}>
          <Text variant="titleSm">Your walker</Text>
          <View style={styles.walkerRow}>
            {booking.walker.photoUrl ? (
              <Image source={{ uri: booking.walker.photoUrl }} style={styles.walkerPhoto} />
            ) : (
              <PersonAvatar name={booking.walker.name} size={60} tone={colors.terracotta} />
            )}
            <View style={{ flex: 1 }}>
              <Text variant="title">{booking.walker.name}</Text>
              <Text variant="bodySm" color={colors.textMuted}>
                {[booking.walker.area, booking.walker.city].filter(Boolean).join(", ")}
              </Text>
              <View style={styles.verified}>
                <Icon name="shield" size={14} color={colors.mossInk} strokeWidth={2.2} />
                <Text variant="caption" color={colors.mossInk} style={{ fontFamily: "Archivo-SemiBold" }}>
                  Verified
                  {booking.walker.yearsExperience
                    ? ` · ${booking.walker.yearsExperience} year${booking.walker.yearsExperience > 1 ? "s" : ""}' experience`
                    : ""}
                </Text>
              </View>
            </View>
          </View>
          {booking.walker.bio ? (
            <Text variant="bodySm" color={colors.textMuted} style={{ marginTop: 12 }}>
              {booking.walker.bio}
            </Text>
          ) : null}
          {booking.walker.languages.length ? (
            <Text variant="caption" color={colors.textSubtle} style={{ marginTop: 8 }}>
              Speaks {booking.walker.languages.join(", ")}
            </Text>
          ) : null}
        </Card>
      ) : active ? (
        <Card tone="muted" style={[styles.block, styles.matching]}>
          <Icon name="search" size={22} color={colors.terracottaInk} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">Walker not assigned yet</Text>
            <Text variant="bodySm" color={colors.textMuted}>
              Their name and details will show here once confirmed.
            </Text>
          </View>
        </Card>
      ) : null}

      {/* Report */}
      {booking.report ? (
        <View style={styles.block}>
          <ReportCard
            report={booking.report}
            petName={booking.pet?.name ?? "Your pet"}
            walkerName={booking.walker?.name}
            title={booking.service === "Walk" ? "Walk report" : "Visit report"}
          />
        </View>
      ) : null}

      {/* Review */}
      {booking.status === "COMPLETED" && accessToken ? (
        <ReviewBlock booking={booking} accessToken={accessToken} onSaved={() => refetch()} />
      ) : null}

      {/* Cancellation */}
      {booking.status === "CANCELLED" && booking.cancellationReason ? (
        <Card tone="muted" style={styles.block}>
          <Text variant="titleSm">Cancellation reason</Text>
          <Text variant="body" style={{ marginTop: 6 }}>
            {booking.cancellationReason}
          </Text>
        </Card>
      ) : null}

      {/* Details */}
      <Card style={styles.block} padding={6}>
        <View style={{ paddingHorizontal: 12 }}>
          <ListRow
            icon="paw"
            title={booking.pet?.name ?? "—"}
            subtitle={booking.pet ? `${booking.pet.breed || booking.pet.species}` : undefined}
          />
          <ListRow
            icon="map-pin"
            title={booking.location?.label.split(",")[0] ?? "—"}
            subtitle={booking.location?.address}
          />
          {booking.notes ? <ListRow icon="edit" title="Notes for your walker" subtitle={booking.notes} /> : null}
          {booking.group ? (
            <ListRow
              icon="calendar"
              title={`Part of a ${booking.group.dayCount}-day pack`}
              subtitle="View all visits"
              onPress={() => router.push(`/pack/${booking.group!.id}`)}
            />
          ) : null}
          <ListRow
            icon="info"
            title={`Booking ID ${booking.id.slice(0, 8).toUpperCase()}`}
            subtitle={`Booked ${shortDate(booking.createdAt)}`}
            last
          />
        </View>
      </Card>

      <Card
        tone="muted"
        onPress={() => router.push({ pathname: "/account/help", params: { booking: booking.id } })}
        style={[styles.block, styles.help]}
      >
        <Icon name="chat" size={20} />
        <Text variant="bodyStrong" style={{ flex: 1 }}>
          Get help with this booking
        </Text>
        <Icon name="chevron-right" size={18} color={colors.textSubtle} />
      </Card>

      {accessToken ? (
        <BookingActionSheet
          visible={managing}
          onClose={() => setManaging(false)}
          booking={booking}
          accessToken={accessToken}
          onUpdated={onUpdated}
        />
      ) : null}
    </Screen>
  );
}

function Timeline({ booking }: { booking: Booking }) {
  const cancelled = booking.status === "CANCELLED";
  const steps: { icon: IconName; title: string; done: boolean }[] = cancelled
    ? [
        { icon: "check", title: "Booked", done: true },
        { icon: "x", title: "Cancelled", done: true },
      ]
    : [
        { icon: "check", title: "Booked", done: true },
        { icon: "users", title: "Walker assigned", done: !!booking.walker || booking.status !== "PENDING" },
        { icon: "camera", title: "Completed", done: booking.status === "COMPLETED" },
      ];
  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => (
        <View key={step.title} style={styles.timelineStep}>
          <View style={styles.timelineTrack}>
            {index > 0 ? (
              <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
            ) : (
              <View style={styles.timelineSpacer} />
            )}
            <View
              style={[
                styles.timelineDot,
                step.done && (cancelled && index === 1 ? styles.timelineDotCancel : styles.timelineDotDone),
              ]}
            >
              <Icon name={step.icon} size={13} color={step.done ? colors.paper : colors.textSubtle} strokeWidth={2.6} />
            </View>
            {index < steps.length - 1 ? (
              <View style={[styles.timelineLine, steps[index + 1]!.done && styles.timelineLineDone]} />
            ) : (
              <View style={styles.timelineSpacer} />
            )}
          </View>
          <Text
            variant="caption"
            align="center"
            color={step.done ? colors.text : colors.textSubtle}
            style={styles.timelineLabel}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ReviewBlock({
  booking,
  accessToken,
  onSaved,
}: {
  booking: Booking;
  accessToken: string;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(booking.review?.rating ?? 0);
  const [comment, setComment] = useState(booking.review?.comment ?? "");
  const [editing, setEditing] = useState(!booking.review);
  const save = useMutation({
    mutationFn: () => reviewBooking(accessToken, booking.id, { rating, comment: comment.trim() || undefined }),
    onSuccess: () => {
      setEditing(false);
      onSaved();
    },
  });

  if (!editing && booking.review) {
    return (
      <Card style={styles.block}>
        <View style={styles.reviewHead}>
          <Text variant="titleSm">Your rating</Text>
          <Text
            variant="bodySm"
            color={colors.terracottaInk}
            onPress={() => setEditing(true)}
            style={{ fontFamily: "Archivo-SemiBold" }}
          >
            Edit
          </Text>
        </View>
        <StarRating value={booking.review.rating} size={22} />
        {booking.review.comment ? (
          <Text variant="bodySm" color={colors.textMuted} style={{ marginTop: 8 }}>
            “{booking.review.comment}”
          </Text>
        ) : null}
      </Card>
    );
  }

  return (
    <Card style={styles.block}>
      <Text variant="titleSm" style={{ marginBottom: 12 }}>
        Rate this {booking.service === "Walk" ? "walk" : "visit"}
      </Text>
      <StarRating value={rating} onChange={setRating} />
      {rating > 0 ? (
        <View style={{ marginTop: 16 }}>
          <TextField
            placeholder={rating >= 4 ? "What went well? (optional)" : "What went wrong? (optional)"}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={1000}
          />
          {save.isError ? (
            <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 10 }}>
              {apiErrorMessage(save.error)}
            </Text>
          ) : null}
          <Button title="Submit rating" onPress={() => save.mutate()} loading={save.isPending} block />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  block: {
    marginTop: 16,
  },
  walkerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },
  walkerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  matching: {
    flexDirection: "row",
    gap: 12,
  },
  help: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reviewHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeline: {
    flexDirection: "row",
    marginTop: 24,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  timelineStep: {
    flex: 1,
    alignItems: "center",
  },
  timelineTrack: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.biscuit3,
  },
  timelineLineDone: {
    backgroundColor: colors.moss,
  },
  timelineSpacer: {
    flex: 1,
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.biscuit3,
  },
  timelineDotDone: {
    backgroundColor: colors.moss,
  },
  timelineDotCancel: {
    backgroundColor: colors.brick,
  },
  timelineLabel: {
    marginTop: 8,
    fontFamily: "Archivo-SemiBold",
    paddingHorizontal: 4,
  },
});
