import type { IconName } from "../components/ui/Icon";

// How walkers are vetted. ASSUMPTION: confirm each step matches the real
// onboarding process before launch.
export const VETTING_STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "id-card",
    title: "ID & address check",
    text: "Government ID and a verified home address for every walker.",
  },
  {
    icon: "shield",
    title: "Police verification",
    text: "A police verification certificate before anyone meets your pet.",
  },
  {
    icon: "chat",
    title: "In-person interview",
    text: "We meet every applicant and ask about the animals in their life.",
  },
  {
    icon: "paw",
    title: "Hands-on assessment",
    text: "A trial walk with our own dogs, observed by a senior walker.",
  },
  {
    icon: "graduation",
    title: "PawMile training",
    text: "Leash handling, dog body language, street-dog safety and pet first aid.",
  },
];

export const WALK_PROMISES: { icon: IconName; title: string; text: string }[] = [
  { icon: "leash", title: "Always on leash", text: "No off-leash running, ever." },
  { icon: "users", title: "Same familiar walker", text: "Plus a trained backup who has met your dog." },
  { icon: "clock", title: "On time, or we tell you", text: "Walkers arrive within a 15-minute window." },
  { icon: "route", title: "Every walk tracked", text: "Live GPS from the door and back again." },
  { icon: "first-aid", title: "First-aid ready", text: "A pet first-aid kit on every walk." },
  { icon: "lock", title: "Your address stays private", text: "Shared only with the walkers assigned to you." },
];

export const LOCAL_CARE: { icon: IconName; title: string; text: string; tone: string }[] = [
  {
    icon: "thermometer",
    title: "Summer-smart",
    text: "From April to June we walk before 9 am and after 5 pm, stick to shade and test the pavement with the back of a hand before paws touch it.",
    tone: "var(--honey)",
  },
  {
    icon: "rain",
    title: "Monsoon-ready",
    text: "Quick dry-off at the door, paw and ear checks against infections, and a covered walk plus indoor play when it really pours.",
    tone: "var(--sage)",
  },
  {
    icon: "paw",
    title: "Street-dog aware",
    text: "Walkers know the neighbourhood packs, pick calmer lanes and keep a respectful distance. No stones, no sticks, no drama.",
    tone: "var(--blush)",
  },
];
