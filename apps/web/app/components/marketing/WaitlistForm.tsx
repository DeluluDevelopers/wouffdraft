"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../lib/http";
import { Icon } from "../ui/Icon";
import { site } from "../../lib/site";
import styles from "./forms.module.css";

export function WaitlistForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      await api("/api/v1/public/enquiries", {
        method: "POST",
        body: {
          topic: "CityWaitlist",
          name: form.get("name"),
          email: form.get("email"),
          city: form.get("city"),
          website: form.get("website"),
        },
      });
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className={`${styles.inlineSuccess} ${tone === "dark" ? styles.onDark : ""}`} role="status">
        <Icon name="check-circle" size={22} />
        You&apos;re on the list. We&apos;ll email you the week we launch in your city.
      </p>
    );
  }

  return (
    <form className={`${styles.waitlist} ${tone === "dark" ? styles.onDark : ""}`} onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="waitlist-name">
        Your name
      </label>
      <input id="waitlist-name" className="input" name="name" placeholder="Your name" autoComplete="name" required />
      <label className="sr-only" htmlFor="waitlist-email">
        Email
      </label>
      <input
        id="waitlist-email"
        className="input"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
      />
      <label className="sr-only" htmlFor="waitlist-city">
        City
      </label>
      <select id="waitlist-city" className="select" name="city" defaultValue={site.waitlistCities[0]}>
        {site.waitlistCities.map((city) => (
          <option key={city}>{city}</option>
        ))}
        <option value="Other">Somewhere else</option>
      </select>
      <input className={styles.honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className={`btn ${tone === "dark" ? "btn-light" : "btn-dark"}`} type="submit" disabled={status === "sending"}>
        {status === "sending" ? <span className="spinner" /> : null}
        Join the waitlist
      </button>
      {error ? (
        <p className={`field-error ${styles.waitlistError}`} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
