import type { CategorySlug, ServiceValue } from "../lib/catalog";
import type { IconName } from "../components/ui/Icon";

export type ServicePageContent = {
  slug: CategorySlug;
  name: string;
  script: string; // short Bimbo line, lowercase, six words or fewer
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  tone: string;
  icon: IconName;
  fromPrice: number;
  priceUnit: string;
  bookService: ServiceValue;
  includes: { icon: IconName; title: string; text: string }[];
  steps: { title: string; text: string }[];
  goodFor: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICE_PAGES: ServicePageContent[] = [
  {
    slug: "dog-walking",
    name: "Dog walks",
    script: "every walk counts",
    title: "Solo walks with a walker who knows your dog",
    intro:
      "One dog, one walker, one leash. Your walker follows your dog's routine, sends a live route while you're at work and a photo report the moment you're home again.",
    image: "/images/walk-golden-leash.jpg",
    imageAlt: "A golden retriever trotting on a leash beside its walker",
    tone: "var(--honey)",
    icon: "footprints",
    fromPrice: 199,
    priceUnit: "per 30-min walk",
    bookService: "Walk",
    includes: [
      { icon: "route", title: "Live GPS route", text: "Follow the walk on a map as it happens." },
      { icon: "camera", title: "Photo walk report", text: "Distance, time, pee and poo, mood and a photo." },
      { icon: "users", title: "The same walker", text: "We keep your dog with one or two familiar faces." },
      { icon: "droplet", title: "Water and paw wipe", text: "Fresh water after and a paw clean at the door." },
      { icon: "leash", title: "Always on leash", text: "No off-leash walks and no unplanned group walks." },
      { icon: "thermometer", title: "Weather-smart", text: "Shaded routes in summer, rain plans in monsoon." },
    ],
    steps: [
      { title: "Choose 30, 45 or 60 minutes", text: "Book a single walk or a pack of 5 to 31 days." },
      { title: "Meet your walker", text: "Your walker is assigned before the first walk and does a short meet-and-greet." },
      { title: "Track it live", text: "Get a notification when the walk starts and a report when it ends." },
    ],
    goodFor: ["Working pet parents", "High-energy breeds", "Puppies learning leash manners", "Senior dogs who need gentle, regular walks"],
    faqs: [
      {
        q: "How long should my dog walk?",
        a: "Most adult dogs do well with 30 to 60 minutes of walking a day, often split into two. Active breeds like Labradors, Beagles and Indies usually love a 45 or 60 minute walk; puppies and seniors are happier with shorter, slower outings.",
      },
      {
        q: "Will you walk my dog with other dogs?",
        a: "No. Every PawMile walk is one-on-one unless you book several of your own dogs together.",
      },
      {
        q: "My dog is reactive to street dogs. Can you help?",
        a: "Yes. Tell us in the booking notes. Your walker plans quieter routes and times, keeps a safe distance and never forces an encounter.",
      },
    ],
  },
  {
    slug: "home-visits",
    name: "Home visits",
    script: "home, but happier",
    title: "Drop-in visits for long workdays and short trips",
    intro:
      "Your carer lets themselves in, refills water, serves meals exactly as you describe, cleans the litter tray or takes your dog out for a potty break, and makes time for play. Great for cats who prefer their own sofa.",
    image: "/images/cat-shelf.jpg",
    imageAlt: "A grey cat sitting calmly on a shelf at home",
    tone: "var(--sage)",
    icon: "home",
    fromPrice: 299,
    priceUnit: "per 30-min visit",
    bookService: "HomeVisit",
    includes: [
      { icon: "bowl", title: "Meals and water", text: "Portions and timings exactly as you write them." },
      { icon: "sparkle", title: "Litter or potty break", text: "Litter scooped or a quick walk outside." },
      { icon: "heart", title: "Play and cuddles", text: "Toys, brushing or quiet company, whatever they like." },
      { icon: "first-aid", title: "Medicines", text: "Oral medicines given on schedule, noted in the report." },
      { icon: "key", title: "Key handover", text: "Keys or codes handled under our key-care steps." },
      { icon: "camera", title: "Visit report", text: "A photo and notes after every visit." },
    ],
    steps: [
      { title: "Share the routine", text: "Feeding, hiding spots, house rules and how to get in." },
      { title: "Book once or every day", text: "Choose 30 or 60 minute visits, once or several times a day." },
      { title: "Get a report every visit", text: "See what they ate, how they were and a fresh photo." },
    ],
    goodFor: ["Cats", "Weekend trips", "Long office days", "Puppies who need a midday break"],
    faqs: [
      {
        q: "How do you handle my keys?",
        a: "Keys are labelled with a code, never your address, and are kept by your assigned carer only. You can also use a lockbox or a smart-lock code.",
      },
      {
        q: "Can you visit twice a day?",
        a: "Yes. Book a morning and an evening visit; many cat parents do this for trips of two days or more.",
      },
    ],
  },
  {
    slug: "pet-sitting",
    name: "Pet sitting",
    script: "never home alone",
    title: "A carer at your home while you're out",
    intro:
      "For weddings, late nights, travel and anxious pets who don't like being alone. A trained carer stays at your home for half a day, a full day or overnight, sticking to your pet's routine.",
    image: "/images/indie-resting.jpg",
    imageAlt: "An Indian dog resting peacefully on a wooden floor",
    tone: "var(--blush)",
    icon: "heart",
    fromPrice: 999,
    priceUnit: "for 4 hours",
    bookService: "PetSitting",
    includes: [
      { icon: "clock", title: "Half day to overnight", text: "4 hours, 8 hours or a 12-hour overnight stay." },
      { icon: "footprints", title: "Walks included", text: "Regular potty breaks and a walk for dogs." },
      { icon: "bowl", title: "Meals and medicines", text: "Fed and medicated exactly on schedule." },
      { icon: "home", title: "Light home care", text: "Plants watered and lights checked if you like." },
      { icon: "chat", title: "Updates through the day", text: "Photos and notes so you can relax." },
      { icon: "shield", title: "Vetted carers only", text: "Only our most experienced carers do sittings." },
    ],
    steps: [
      { title: "Pick a length", text: "Half day, full day or overnight." },
      { title: "Meet beforehand", text: "We arrange a short meet-and-greet before the first sitting." },
      { title: "Relax", text: "Updates through the sitting and a full report at the end." },
    ],
    goodFor: ["Pets with separation anxiety", "Senior or recovering pets", "Multi-pet homes", "Festival nights"],
    faqs: [
      {
        q: "Will the sitter sleep at my home overnight?",
        a: "Yes, for overnight sittings the carer stays from evening to morning. You decide which room they use.",
      },
      {
        q: "Is there a festival surcharge?",
        a: "Diwali and New Year's Eve are our busiest nights. Prices stay the same, but we recommend booking a week ahead.",
      },
    ],
  },
  {
    slug: "grooming",
    name: "Grooming at home",
    script: "fresh, fluffy, fuss-free",
    title: "Salon-quality grooming in your own bathroom",
    intro:
      "No travel, no cages, no waiting rooms. Our groomers bring their own kit, pet-safe products and a calm approach, and clean up after themselves.",
    image: "/images/groom-towel.jpg",
    imageAlt: "A freshly bathed dog wrapped in a soft towel",
    tone: "var(--moss)",
    icon: "scissors",
    fromPrice: 149,
    priceUnit: "nail trim, from",
    bookService: "Bathing",
    includes: [
      { icon: "bath", title: "Bath & dry", text: "Shampoo, conditioner and a towel-and-dryer finish." },
      { icon: "scissors", title: "Haircut & styling", text: "Breed-appropriate cuts, bath included." },
      { icon: "sparkle", title: "Spa day", text: "Massage, paw balm, nails and a fresh scent." },
      { icon: "paw", title: "Nails & hygiene", text: "Nail clips, paw pads and sanitary trims." },
      { icon: "smile", title: "Ears & teeth", text: "Gentle ear clean and teeth brushing." },
      { icon: "home", title: "We clean up", text: "Bathroom wiped down and hair cleared." },
    ],
    steps: [
      { title: "Choose a treatment", text: "From a quick nail trim to a full spa day." },
      { title: "We bring everything", text: "Tools, products and towels. You just need a bathroom with water." },
      { title: "Before and after", text: "Photos and notes on coat, skin and ears." },
    ],
    goodFor: ["Pets who get anxious at salons", "Long-coated breeds", "Puppies' first grooms", "Cats (bath-free options)"],
    faqs: [
      {
        q: "Which products do you use?",
        a: "Mild, pet-specific shampoos and conditioners. If your vet has prescribed a medicated shampoo, hand it to the groomer and we'll use that.",
      },
      {
        q: "Do you groom cats?",
        a: "Yes, for brushing, de-matting, nail trims and hygiene trims. We only bathe cats who are comfortable with water.",
      },
    ],
  },
];

export function servicePage(slug: string) {
  return SERVICE_PAGES.find((page) => page.slug === slug);
}
