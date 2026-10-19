// Same answers as the website FAQ (apps/web/app/content/faqs.ts).
export type Faq = { q: string; a: string };

export const FAQS: { title: string; items: Faq[] }[] = [
  {
    title: "Booking & pricing",
    items: [
      {
        q: "How much does a dog walk cost?",
        a: "A 30-minute walk is ₹199, 45 minutes is ₹259 and 60 minutes is ₹319. Book 5 or more days together to save 5%, 12+ days saves 10% and 22+ days saves 15%. Prices include GST.",
      },
      {
        q: "How far ahead do I need to book?",
        a: "At least 2 hours before the visit. For “as soon as possible” requests we confirm a walker within the hour when one is free nearby.",
      },
      {
        q: "When and how do I pay?",
        a: "After each visit, by UPI, card or cash. For packs we send one invoice at the start. In-app payment is coming soon.",
      },
      {
        q: "Can I book for more than one pet?",
        a: "Yes. Add each pet in the Pets tab and book them for the same slot. Each dog gets their own walker unless they're used to walking together and you ask for it.",
      },
    ],
  },
  {
    title: "Walkers & safety",
    items: [
      {
        q: "Who are PawMile walkers?",
        a: "Local dog people we've vetted in five steps: ID and address checks, police verification, an in-person interview, a hands-on assessment with dogs, and training in leash handling, dog body language and pet first aid.",
      },
      {
        q: "Will I get the same walker every time?",
        a: "That's the plan. We match you with one walker and a trained backup who has met your pet, so walks don't stop when someone is on leave.",
      },
      {
        q: "What happens in an emergency?",
        a: "Walkers carry a first-aid kit and follow our emergency steps: keep your pet safe, call you, and if needed take them to the nearest open vet with you on the phone. Our support team stays on the line.",
      },
      {
        q: "How do you handle street dogs?",
        a: "Walkers pick calmer routes and times, give space and never use force. If your dog is reactive, mention it in the booking notes and we'll plan around it.",
      },
    ],
  },
  {
    title: "Changes & cancellations",
    items: [
      {
        q: "Can I cancel or reschedule?",
        a: "Yes, from the booking itself. It's free up to 2 hours before the visit. After that, a 50% fee may apply because your walker has already set out.",
      },
      {
        q: "What if my walker can't make it?",
        a: "We send your trained backup. If no one suitable is free, we tell you right away and the visit is free to move or cancel.",
      },
      {
        q: "What about heavy rain or extreme heat?",
        a: "In heavy rain we switch to a shorter covered walk plus indoor play. On very hot days we walk early or late, stay in the shade and check paw pads on hot pavement.",
      },
    ],
  },
];
