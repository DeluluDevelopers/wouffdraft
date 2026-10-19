import { FREE_CANCELLATION_HOURS } from "../lib/catalog";
import { site } from "../lib/site";

// Starter policies written for an Indian pet-care service. Have them reviewed
// by a lawyer before launch.
export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of service",
    summary: "The agreement between you and PawMile when you book a walk, visit, sitting or grooming session.",
    updated: "19 October 2026",
    sections: [
      {
        heading: "1. Who we are",
        body: [
          `${site.legalName} ("PawMile", "we", "us") connects pet parents in ${site.launchCity} with vetted walkers, carers and groomers ("carers"). By creating an account or making a booking you agree to these terms.`,
        ],
      },
      {
        heading: "2. Your account",
        body: [
          "You sign in with a mobile number and a one-time code. Keep your phone secure; you're responsible for bookings made from your account.",
          "You must be 18 or older and the owner or legal guardian of the pets you book for.",
        ],
      },
      {
        heading: "3. Your pet's information",
        body: [
          "Tell us honestly about your pet's age, health, vaccinations, temperament and any history of biting, escaping or reactivity. Carers rely on this to keep everyone safe.",
          "Dogs must be walked on a secure collar or harness and leash that you provide. We may decline or end a visit if a pet's safety, or a carer's, is at risk.",
          "We recommend pets are vaccinated against rabies and other core diseases. Please tell us if they are not.",
        ],
      },
      {
        heading: "4. Bookings and prices",
        body: [
          "Prices are shown in Indian rupees and include GST. Pack discounts apply to bookings of five or more days made together.",
          "A booking is confirmed when a carer is assigned. We'll tell you if we can't fill a slot, and you won't be charged for it.",
          "Payment is due after each visit, or at the start of a pack, by the methods shown at checkout.",
        ],
      },
      {
        heading: "5. Cancellations",
        body: [
          `You can cancel or reschedule for free up to ${FREE_CANCELLATION_HOURS} hours before a visit. See our cancellation and refund policy for the full rules.`,
        ],
      },
      {
        heading: "6. Keys and access",
        body: [
          "If you share keys or door codes, we store them under a reference code, never with your address, and only your assigned carer and backup can use them. Keys are returned when you ask or when your bookings end.",
        ],
      },
      {
        heading: "7. Emergencies and vet care",
        body: [
          "If your pet is injured or unwell during a visit, the carer will contact you straight away. If we can't reach you and it's urgent, you authorise us to take your pet to the nearest available vet. You're responsible for vet fees unless the injury was caused by our negligence.",
        ],
      },
      {
        heading: "8. Our responsibility",
        body: [
          "We vet and train our carers and take reasonable care. We aren't responsible for harm that comes from information you didn't share, from a pet's pre-existing condition, or from events outside our reasonable control. Nothing here limits rights you have under the Consumer Protection Act, 2019.",
        ],
      },
      {
        heading: "9. Conduct",
        body: [
          "Please treat carers with respect. We may suspend accounts after abuse, unsafe conditions or repeated no-shows.",
        ],
      },
      {
        heading: "10. Changes and contact",
        body: [
          `We may update these terms; we'll tell you about significant changes before they apply. Questions? Write to ${site.email}.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    summary: "What we collect, why, and the choices you have, in line with India's Digital Personal Data Protection Act, 2023.",
    updated: "19 October 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Account details: your name, mobile number and, if you add it, email address.",
          "Addresses you save for visits, with map coordinates so carers can find you.",
          "Pet details: name, species, breed, age, gender, vaccination status and any health notes you choose to share.",
          "Booking history, visit reports (including walk routes and photos) and reviews.",
          "Basic technical data such as browser type and pages visited, to keep the site secure and working.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "To provide the services you book, match you with carers, send updates and reports, take payment, support you, and keep pets and carers safe.",
          "We don't sell your data and we don't use your pet's photos in marketing without asking you first.",
        ],
      },
      {
        heading: "Who sees it",
        body: [
          "Your assigned carer sees your first name, the visit address, access instructions and your pet's details for the bookings they cover.",
          "Service providers who help us run PawMile (hosting, SMS, maps and payments) process data on our behalf under contract.",
          "We'll share information with authorities only when the law requires it.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "While your account is active and for up to 3 years after your last booking, unless the law requires us to keep it longer (for example, tax records).",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask to see, correct or erase your personal data, withdraw consent, or name someone to act for you. Write to ${site.email} and we'll respond within 30 days.`,
          "If you're not happy with our response, you can complain to the Data Protection Board of India.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use essential cookies to keep you signed in and to protect the site. We don't use advertising cookies.",
        ],
      },
    ],
  },
  {
    slug: "cancellation",
    title: "Cancellation & refund policy",
    summary: "Plain rules for changing or cancelling a booking.",
    updated: "19 October 2026",
    sections: [
      {
        heading: "Cancelling a visit",
        body: [
          `Free up to ${FREE_CANCELLATION_HOURS} hours before the scheduled start.`,
          `Within ${FREE_CANCELLATION_HOURS} hours of the start, we may charge 50% of the visit, because your carer has already planned around you.`,
          "If the carer is already at your door and the visit can't go ahead, the full visit may be charged.",
        ],
      },
      {
        heading: "Rescheduling",
        body: [
          `Free up to ${FREE_CANCELLATION_HOURS} hours before the visit, subject to carer availability for the new time.`,
        ],
      },
      {
        heading: "Packs",
        body: [
          "You can cancel any remaining days in a pack. Days already completed are charged at the pack rate; unused days are refunded or not charged.",
        ],
      },
      {
        heading: "When we cancel",
        body: [
          "If we can't provide a carer, or cancel for weather or safety reasons, you won't be charged, and any prepayment is refunded in full.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds go back to the original payment method within 5 to 7 working days.",
          `Not happy with a visit? Tell us within 48 hours at ${site.email} and we'll make it right, whether that's a repeat visit or a refund.`,
        ],
      },
    ],
  },
];

export function legalDoc(slug: string) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}
