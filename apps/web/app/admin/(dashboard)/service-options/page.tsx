"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServiceOptions,
  updateServiceOption,
  type AdminServiceOption,
} from "@/admin/lib/admin-api";
import { ServiceOptionForm } from "@/admin/components/ServiceOptionForm";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";

export default function AdminServiceOptionsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data: options,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "service-options"],
    queryFn: getServiceOptions,
  });

  const toggleActive = useMutation({
    mutationFn: (option: AdminServiceOption) =>
      updateServiceOption(option.id, { isActive: !option.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-options"] });
    },
  });

  if (isLoading) {
    return (
      <div>
        <PageHeaderSkeleton />
        <TableSkeleton rows={7} columns={6} />
      </div>
    );
  }

  if (isError || !options) {
    return (
      <div>
        <div className="admin-page-header">
          <div className="admin-page-title">Service catalog</div>
        </div>
        <div className="admin-card admin-muted">Failed to load service options.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Service catalog</div>
          <div className="admin-page-subtitle">
            {options.length} duration tier{options.length === 1 ? "" : "s"} across all
            services — prices/durations shown in the app's booking flows.
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-title">Add a duration tier</div>
        <ServiceOptionForm />
      </div>

      <div className="admin-table-wrap">
        {options.length === 0 ? (
          <div className="admin-table-empty">No service options yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Label</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) =>
                editingId === option.id ? (
                  <tr key={option.id}>
                    <td colSpan={6}>
                      <ServiceOptionForm
                        serviceOption={option}
                        onDone={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={option.id}>
                    <td>{option.service}</td>
                    <td>{option.label}</td>
                    <td>{option.durationMinutes} min</td>
                    <td>₹{option.priceInRupees}</td>
                    <td>{option.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="admin-button admin-button-secondary"
                          onClick={() => setEditingId(option.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-button admin-button-secondary"
                          disabled={toggleActive.isPending}
                          onClick={() => toggleActive.mutate(option)}
                        >
                          {option.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
