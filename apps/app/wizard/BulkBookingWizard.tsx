import React, { createContext, useContext, useState } from "react";
import type { TimeSlotKey } from "@/constants/BulkBookingSlots";

export type Service =
  | "Bathing"
  | "Cutting"
  | "Hygiene"
  | "BlowDry"
  | "NailTrim"
  | "Spa"
  | "Cleaning";

export type DayBooking = {
  date: string; // ISO date, e.g. "2026-07-10"
  service: Service | null;
  serviceOptionId: string | null;
  durationMinutes: number | null;
  priceInRupees: number | null;
  timeSlot: TimeSlotKey | null;
};

export type BulkBookingData = {
  petId: string | null;
  locationId: string | null;
  days: DayBooking[];
};

const defaultData: BulkBookingData = {
  petId: null,
  locationId: null,
  days: [],
};

type BulkBookingContextType = {
  data: BulkBookingData;
  setPet: (petId: string) => void;
  setLocation: (locationId: string) => void;
  toggleDate: (date: string) => void;
  updateDay: (date: string, patch: Partial<DayBooking>) => void;
  removeDay: (date: string) => void;
  reset: () => void;
};

const BulkBookingContext = createContext<BulkBookingContextType | null>(null);

function emptyDay(date: string): DayBooking {
  return {
    date,
    service: null,
    serviceOptionId: null,
    durationMinutes: null,
    priceInRupees: null,
    timeSlot: null,
  };
}

export function BulkBookingWizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BulkBookingData>(defaultData);

  const setPet = (petId: string) => setData((prev) => ({ ...prev, petId }));

  const setLocation = (locationId: string) =>
    setData((prev) => ({ ...prev, locationId }));

  const toggleDate = (date: string) =>
    setData((prev) => {
      const exists = prev.days.some((day) => day.date === date);
      if (exists) {
        return { ...prev, days: prev.days.filter((day) => day.date !== date) };
      }
      const days = [...prev.days, emptyDay(date)].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      return { ...prev, days };
    });

  const updateDay = (date: string, patch: Partial<DayBooking>) =>
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => (day.date === date ? { ...day, ...patch } : day)),
    }));

  const removeDay = (date: string) =>
    setData((prev) => ({ ...prev, days: prev.days.filter((day) => day.date !== date) }));

  const reset = () => setData(defaultData);

  return (
    <BulkBookingContext.Provider
      value={{ data, setPet, setLocation, toggleDate, updateDay, removeDay, reset }}
    >
      {children}
    </BulkBookingContext.Provider>
  );
}

export function useBulkBookingWizard() {
  const ctx = useContext(BulkBookingContext);
  if (!ctx) {
    throw new Error(
      "useBulkBookingWizard must be used inside BulkBookingWizardProvider",
    );
  }
  return ctx;
}
