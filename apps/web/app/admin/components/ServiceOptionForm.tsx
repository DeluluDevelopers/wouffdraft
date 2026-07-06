"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceOption,
  updateServiceOption,
  type AdminServiceOption,
} from "@/admin/lib/admin-api";

const SERVICE_VALUES = [
  "Bathing",
  "Cutting",
  "Hygiene",
  "BlowDry",
  "NailTrim",
  "Spa",
  "Cleaning",
] as const;

export function ServiceOptionForm({
  serviceOption,
  onDone,
}: {
  serviceOption?: AdminServiceOption;
  onDone?: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!serviceOption;
  const [service, setService] = useState(serviceOption?.service ?? SERVICE_VALUES[0]);
  const [durationMinutes, setDurationMinutes] = useState(
    String(serviceOption?.durationMinutes ?? ""),
  );
  const [label, setLabel] = useState(serviceOption?.label ?? "");
  const [priceInRupees, setPriceInRupees] = useState(
    String(serviceOption?.priceInRupees ?? ""),
  );
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      if (isEdit) {
        return updateServiceOption(serviceOption.id, {
          label,
          priceInRupees: Number(priceInRupees),
          durationMinutes: Number(durationMinutes),
        });
      }
      return createServiceOption({
        service,
        durationMinutes: Number(durationMinutes),
        label,
        priceInRupees: Number(priceInRupees),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-options"] });
      setError("");
      if (!isEdit) {
        setLabel("");
        setDurationMinutes("");
        setPriceInRupees("");
      }
      onDone?.();
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        {!isEdit && (
          <div>
            <div className="admin-label">Service</div>
            <select
              className="admin-select"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {SERVICE_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <div className="admin-label">Label</div>
          <input
            className="admin-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. 30-45 min"
            style={{ width: 140 }}
          />
        </div>
        <div>
          <div className="admin-label">Duration (min)</div>
          <input
            className="admin-input"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            style={{ width: 100 }}
          />
        </div>
        <div>
          <div className="admin-label">Price (₹)</div>
          <input
            className="admin-input"
            type="number"
            value={priceInRupees}
            onChange={(e) => setPriceInRupees(e.target.value)}
            style={{ width: 100 }}
          />
        </div>
        <button
          className="admin-button"
          disabled={mutation.isPending || !label.trim() || !durationMinutes || !priceInRupees}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving..." : isEdit ? "Save" : "Add tier"}
        </button>
        {isEdit && onDone && (
          <button className="admin-button admin-button-secondary" onClick={onDone}>
            Cancel
          </button>
        )}
      </div>
      {error && (
        <div className="admin-login-error" style={{ marginTop: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
}
