import React, { createContext, useContext, useState } from "react";

export type PetForm = {
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  ageMonths: string;
  gender: "Male" | "Female";
  vaccinationStatus: "UpToDate" | "Partial" | "None";
  medicalConditions: boolean;
  medicalHistory: string;
};

export type WizardData = {
  name: string;
  label: string;
  placeId: string;
  pets: PetForm[];
};

const defaultData: WizardData = {
  name: "",
  label: "",
  placeId: "",
  pets: [],
};

type WizardContextType = {
  data: WizardData;
  setName: (name: string) => void;
  setAddress: (label: string, placeId: string) => void;
  addPet: () => void;
  updatePet: (index: number, pet: PetForm) => void;
  removePet: (index: number) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextType | null>(null);

export function ProfileWizardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<WizardData>(defaultData);

  const setName = (name: string) => setData((prev) => ({ ...prev, name }));

  const setAddress = (label: string, placeId: string) =>
    setData((prev) => ({ ...prev, label, placeId }));

  const addPet = () =>
    setData((prev) => ({
      ...prev,
      pets: [
        ...prev.pets,
        {
          name: "",
          species: "Dog" as const,
          breed: "",
          ageMonths: "",
          gender: "Male" as const,
          vaccinationStatus: "UpToDate" as const,
          medicalConditions: false,
          medicalHistory: "",
        },
      ],
    }));

  const updatePet = (index: number, pet: PetForm) =>
    setData((prev) => {
      const pets = [...prev.pets];
      pets[index] = pet;
      return { ...prev, pets };
    });

  const removePet = (index: number) =>
    setData((prev) => ({
      ...prev,
      pets: prev.pets.filter((_, i) => i !== index),
    }));

  const reset = () => setData(defaultData);

  return (
    <WizardContext.Provider
      value={{ data, setName, setAddress, addPet, updatePet, removePet, reset }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useProfileWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useProfileWizard must be used inside ProfileWizardProvider");
  }
  return ctx;
}
