import React, { createContext, useContext, useState } from "react";
import type { AddressChoice } from "@/components/address/AddressSearch";
import type { PetDraft } from "@/components/pets/PetForm";

export type WizardData = {
  name: string;
  address: AddressChoice | null;
  pets: PetDraft[];
};

const defaultData: WizardData = {
  name: "",
  address: null,
  pets: [],
};

type WizardContextType = {
  data: WizardData;
  setName: (name: string) => void;
  setAddress: (address: AddressChoice | null) => void;
  setPets: (pets: PetDraft[]) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextType | null>(null);

// Onboarding collects everything first and submits it in one API call.
export function ProfileWizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WizardData>(defaultData);

  const value: WizardContextType = {
    data,
    setName: (name) => setData((prev) => ({ ...prev, name })),
    setAddress: (address) => setData((prev) => ({ ...prev, address })),
    setPets: (pets) => setData((prev) => ({ ...prev, pets })),
    reset: () => setData(defaultData),
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useProfileWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useProfileWizard must be used inside ProfileWizardProvider");
  }
  return ctx;
}
