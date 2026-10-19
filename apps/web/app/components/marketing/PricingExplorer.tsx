"use client";

import { useState } from "react";
import {
  CATEGORIES,
  PACK_DISCOUNTS,
  SERVICE_LABELS,
  SERVICE_SUMMARIES,
  formatRupees,
  packDiscountPercent,
  type CategorySlug,
  type ServiceOptionData,
} from "../../lib/catalog";
import { Icon } from "../ui/Icon";
import styles from "./PricingExplorer.module.css";

const PLANS = [
  { days: 1, label: "Single visit" },
  { days: 5, label: "5-day pack" },
  { days: 12, label: "12-day pack" },
  { days: 22, label: "Monthly · 22 days" },
] as const;

const POPULAR_DURATION: Partial<Record<CategorySlug, number>> = {
  "dog-walking": 45,
  "home-visits": 30,
  "pet-sitting": 480,
};

export function PricingExplorer({
  options,
  initialCategory = "dog-walking",
}: {
  options: ServiceOptionData[];
  initialCategory?: CategorySlug;
}) {
  const [category, setCategory] = useState<CategorySlug>(initialCategory);
  const [days, setDays] = useState<number>(category === "grooming" ? 1 : 22);

  const current = CATEGORIES.find((item) => item.slug === category)!;
  const visible = options.filter((option) => current.services.includes(option.service));
  const isGrooming = category === "grooming";
  const percent = isGrooming ? 0 : packDiscountPercent(days);

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={styles.tabs} role="tablist" aria-label="Service">
          {CATEGORIES.map((item) => (
            <button
              key={item.slug}
              role="tab"
              type="button"
              aria-selected={item.slug === category}
              className={item.slug === category ? styles.tabActive : styles.tab}
              onClick={() => {
                setCategory(item.slug);
                if (item.slug === "grooming") setDays(1);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        {!isGrooming ? (
          <div className={styles.plans} role="radiogroup" aria-label="How often">
            {PLANS.map((plan) => (
              <button
                key={plan.days}
                type="button"
                role="radio"
                aria-checked={plan.days === days}
                className={plan.days === days ? styles.planActive : styles.plan}
                onClick={() => setDays(plan.days)}
              >
                {plan.label}
                {packDiscountPercent(plan.days) > 0 ? (
                  <span className={styles.save}>−{packDiscountPercent(plan.days)}%</span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className={`${styles.grid} ${isGrooming ? styles.gridDense : ""}`} role="tabpanel">
        {visible.map((option) => {
          const perVisit = Math.round(option.priceInRupees * (1 - percent / 100));
          const popular = POPULAR_DURATION[category] === option.durationMinutes;
          return (
            <article key={option.id} className={`${styles.card} ${popular ? styles.popular : ""}`}>
              {popular ? <span className={`badge badge-honey ${styles.popularBadge}`}>Most booked</span> : null}
              <p className="t-label">{isGrooming ? SERVICE_LABELS[option.service] : option.label}</p>
              {isGrooming ? <p className={styles.summary}>{SERVICE_SUMMARIES[option.service]}</p> : null}
              <p className={styles.price}>
                <span className="t-num">{formatRupees(perVisit)}</span>
                <small>/ {category === "dog-walking" ? "walk" : "visit"}</small>
              </p>
              {percent > 0 ? (
                <p className={styles.strike}>
                  <s>{formatRupees(option.priceInRupees)}</s> · {formatRupees(perVisit * days)} for {days} days
                </p>
              ) : (
                <p className={styles.strike}>{isGrooming ? option.label : "Pay after the visit"}</p>
              )}
            </article>
          );
        })}
      </div>

      <ul className={styles.notes}>
        <li>
          <Icon name="check" size={16} strokeWidth={2.2} /> Prices include GST
        </li>
        <li>
          <Icon name="check" size={16} strokeWidth={2.2} /> Free cancellation up to 2 hours before
        </li>
        <li>
          <Icon name="check" size={16} strokeWidth={2.2} /> Packs:{" "}
          {PACK_DISCOUNTS.slice()
            .reverse()
            .map((tier) => `${tier.minDays}+ days −${tier.percent}%`)
            .join(" · ")}
        </li>
      </ul>
    </div>
  );
}
