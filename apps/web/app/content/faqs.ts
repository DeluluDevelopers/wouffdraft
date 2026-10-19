import { FREE_CANCELLATION_HOURS } from "../lib/catalog";
import { site } from "../lib/site";

export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "booking",
    title: "Booking & pricing",
    items: [
      {
        q: "How much does a dog walk cost?",
        a: "A 30-minute walk is ₹199, 45 minutes is ₹259 and 60 minutes is ₹319. Book 5 or more days together and you save 5%, 12+ days saves 10% and 22+ days saves 15%. Prices include GST.",
      },
      {
        q: "How far ahead do I need to book?",
        a: "At least 2 hours before the visit for a scheduled booking. For “as soon as possible” requests we confirm a walker within the hour when one is free nearby.",
      },
      {
        q: "When and how do I pay?",
        a: "You pay after each visit by UPI, card or cash. For packs we send one invoice at the start. Online pre-payment in the app is coming soon.",
      },
      {
        q: "Can I book for more than one pet?",
        a: "Yes. Add each pet to your profile and book them for the same slot. For walks, each dog gets its own walker unless they're used to walking together and you ask for it.",
      },
      {
        q: "Which areas do you cover?",
        a: `We're walking across ${site.launchCity}: ${site.liveAreas.slice(0, 6).join(", ")} and more. ${site.waitlistCities.join(", ")} are next. Join the waitlist and we'll tell you first.`,
      },
    ],
  },
  {
    id: "walkers",
    title: "Walkers & safety",
    items: [
      {
        q: "Who are PawMile walkers?",
        a: "Local dog people we've vetted in five steps: ID and address checks, police verification, an in-person interview, a hands-on assessment with dogs, and training on leash handling, dog body language and pet first aid.",
      },
      {
        q: "Will I get the same walker every time?",
        a: "That's the plan. We match you with one walker and a trained backup who has met your dog, so walks don't stop when someone is on leave.",
      },
      {
        q: "What happens in an emergency?",
        a: "Walkers carry a basic first-aid kit and follow our emergency steps: keep the pet safe, call you, and if needed take them to the nearest open vet with you on the phone. Our support team stays on the line throughout.",
      },
      {
        q: "Are walks off-leash ever?",
        a: "Never. Every walk is on a secure collar or harness and a leash, whatever the location.",
      },
      {
        q: "How do you handle street dogs on walks?",
        a: "Walkers learn to read the street: they pick calmer routes and times, give space, stay calm and never use force. If your dog is reactive, note it in the booking and we'll plan around it.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes & cancellations",
    items: [
      {
        q: "Can I cancel or reschedule?",
        a: `Yes, from your account. It's free up to ${FREE_CANCELLATION_HOURS} hours before the visit. Later than that, we may charge 50% of the visit because your walker has already set out.`,
      },
      {
        q: "What if my walker can't make it?",
        a: "We send your trained backup walker. If no one suitable is free, we tell you right away and the visit is free to move or cancel.",
      },
      {
        q: "What about heavy rain or extreme heat?",
        a: "In heavy rain we switch to a shorter walk under cover plus indoor play. On very hot days we walk early or late, keep to shade and check paw pads on hot pavement.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    items: [
      {
        q: "How do I log in?",
        a: "With your mobile number. We send a 6-digit code by SMS, so there's no password to remember.",
      },
      {
        q: "Is my data safe?",
        a: "We only collect what we need to care for your pet, never sell your data, and your exact address is shared only with the walker assigned to you. Read our privacy policy for details.",
      },
      {
        q: "Is there an app?",
        a: "The PawMile app for iPhone and Android is on its way. Until then everything (booking, live updates and reports) works in your browser.",
      },
    ],
  },
];

export const HOME_FAQS: Faq[] = [
  FAQ_GROUPS[0]!.items[0]!,
  FAQ_GROUPS[1]!.items[0]!,
  FAQ_GROUPS[1]!.items[1]!,
  FAQ_GROUPS[2]!.items[0]!,
  FAQ_GROUPS[0]!.items[2]!,
  FAQ_GROUPS[2]!.items[2]!,
];
