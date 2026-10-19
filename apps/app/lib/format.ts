// Display helpers. Prices and numbers use Archivo (never the script face).

export function rupees(amount: number | null | undefined) {
  if (amount == null) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function duration(minutes: number | null | undefined) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr${hours > 1 ? "s" : ""}` : `${hours.toFixed(1)} hrs`;
}

export function petAge(months: number) {
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} yr ${rest} mo` : `${years} yr${years > 1 ? "s" : ""}`;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function dayLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function timeLabel(date: Date) {
  const hour = date.getHours();
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(date.getMinutes()).padStart(2, "0")} ${hour < 12 ? "am" : "pm"}`;
}

export function whenLabel(iso: string | null | undefined, type?: string) {
  if (!iso) return type === "Instant" ? "As soon as possible" : "Time to be confirmed";
  const date = new Date(iso);
  return `${dayLabel(date)}, ${timeLabel(date)}`;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Indian numbers display as "91 98765 43210" (no plus sign).
export function phone(value: string | null | undefined) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return digits;
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "good morning";
  if (hour < 17) return "good afternoon";
  return "good evening";
}

export function firstName(name: string | null | undefined) {
  return name?.trim().split(" ")[0] ?? "";
}

export function km(meters: number | null | undefined) {
  if (meters == null) return "—";
  return (meters / 1000).toFixed(1);
}
