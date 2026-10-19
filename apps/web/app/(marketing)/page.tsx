import Image from "next/image";
import { buttonClass } from "../components/ui/ButtonLink";
import { Icon, type IconName } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { PawMark } from "../components/brand/PawMark";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { FaqJsonLd, FaqList } from "../components/marketing/FaqList";
import { CtaBand } from "../components/marketing/CtaBand";
import { StoreButtons } from "../components/marketing/StoreButtons";
import { LiveWalkPhone } from "../components/marketing/LiveWalkPhone";
import { PricingExplorer } from "../components/marketing/PricingExplorer";
import { WaitlistForm } from "../components/marketing/WaitlistForm";
import { ReportCard } from "../components/report/ReportCard";
import { SAMPLE_ROUTE } from "../components/report/sampleRoute";
import { SERVICE_PAGES } from "../content/services";
import { FAQ_GROUPS } from "../content/faqs";
import { LOCAL_CARE, VETTING_STEPS } from "../content/trust";
import { getPublicServiceOptions, lowestPrice } from "../lib/pricing";
import { CATEGORIES, formatRupees } from "../lib/catalog";
import { site } from "../lib/site";
import styles from "./home.module.css";

export const revalidate = 3600;

const STEPS = [
  {
    script: "one",
    title: "Book in the app",
    text: "Sign in with your phone number, add your pet and pick a walk, visit or sitting from 6 am to 9 pm. Once, or as a pack.",
  },
  {
    script: "two",
    title: "Meet your walker",
    text: "We match you with a vetted local walker and a backup. They meet your dog before the first walk.",
  },
  {
    script: "three",
    title: "Follow every step",
    text: "Get a ping when the walk starts, follow the route live and read the photo report when they're home.",
  },
];

const LANDING_FAQS = FAQ_GROUPS.flatMap((group) => group.items).filter((item) =>
  [
    "How much does a dog walk cost?",
    "Who are PawMile walkers?",
    "Will I get the same walker every time?",
    "Can I cancel or reschedule?",
    "When and how do I pay?",
    "What about heavy rain or extreme heat?",
    "How do I log in?",
    "Which areas do you cover?",
  ].includes(item.q),
);

const REPORT_FEATURES: { icon: IconName; text: string }[] = [
  { icon: "bell", text: "A notification the moment the walk starts and ends" },
  { icon: "route", text: "Live GPS route on a map" },
  { icon: "check-circle", text: "Pee, poo, water and food, ticked off" },
  { icon: "camera", text: "A photo and a short note from your walker" },
];

function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PawMile",
    description: site.description,
    url: site.url,
    email: site.email,
    image: `${site.url}/brand/pawmile-primary-charcoal.png`,
    priceRange: "₹149 – ₹1,899",
    areaServed: { "@type": "City", name: site.launchCity },
    sameAs: [site.instagram],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function HomePage() {
  const options = await getPublicServiceOptions();

  return (
    <>
      <LocalBusinessJsonLd />
      <FaqJsonLd items={LANDING_FAQS} />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={`chip ${styles.heroChip}`}>
              <span className={styles.liveDot} aria-hidden="true" />
              Now walking in {site.launchCity}
            </p>
            <h1 className={styles.heroTitle}>
              <span className={`t-display ${styles.heroScript}`}>every walk counts</span>
              <span className={`t-title-lg ${styles.heroLine}`}>
                Trusted dog walkers and pet care, right at your door.
              </span>
            </h1>
            <p className={`t-body-lg ${styles.heroIntro}`}>
              Vetted local walkers, a live GPS route while you&apos;re at work and a photo report the
              minute your dog is home again. All in the PawMile app.
            </p>
            <div className={styles.heroActions}>
              <StoreButtons />
            </div>
            <p className={styles.heroNote}>
              Free to download · Walks from {formatRupees(lowestPrice(options, ["Walk"]) ?? 199)} · Pay
              after each visit
            </p>
            <ul className={styles.heroTrust}>
              <li>
                <Icon name="shield" size={18} /> Police-verified walkers
              </li>
              <li>
                <Icon name="route" size={18} /> Every walk GPS-tracked
              </li>
              <li>
                <Icon name="camera" size={18} /> Photo report after
              </li>
            </ul>
          </div>

          <div className={styles.heroMedia}>
            <div className={styles.heroPanel} aria-hidden="true">
              <div className={styles.heroPhoto}>
                <Image
                  src="/images/walk-golden-leash.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              </div>
              <PawMark size={96} className={styles.heroPanelPaw} />
            </div>
            <div className={styles.heroPhone}>
              <LiveWalkPhone />
            </div>
            <div className={styles.heroToast} aria-hidden="true">
              <span className={styles.toastIcon}>
                <Icon name="bell" size={18} />
              </span>
              <span>
                <strong>Bruno is home!</strong>
                <span>Walk report ready · 2.5 km</span>
              </span>
            </div>
            <div className={styles.heroReport} aria-hidden="true">
              <ReportCard
                compact
                data={{
                  petName: "Bruno",
                  mood: "Happy",
                  dateLabel: "7:30 – 8:02 am",
                  distanceMeters: 2480,
                  durationMinutes: 32,
                  pee: true,
                  poo: true,
                  water: true,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section" id="services">
        <div className="container">
          <SectionHeading
            label="What we do"
            script="care, door to door"
            title="Four ways we look after your pet"
            intro="Everything happens at or from your home, by people who've passed our five-step vetting. Book any of them in the app."
          />
          <div className={styles.serviceGrid}>
            {SERVICE_PAGES.map((service, index) => {
              const category = CATEGORIES.find((item) => item.slug === service.slug)!;
              const from = lowestPrice(options, category.services) ?? service.fromPrice;
              return (
                <Reveal key={service.slug} delay={index * 80}>
                  <div className={styles.serviceCard}>
                    <div className={styles.servicePhoto}>
                      <Image src={service.image} alt={service.imageAlt} fill sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 92vw" />
                      <span className={styles.serviceIcon} style={{ background: service.tone }}>
                        <Icon name={service.icon} size={22} />
                      </span>
                    </div>
                    <div className={styles.serviceBody}>
                      <h3 className="t-title">{service.name}</h3>
                      <p className="t-muted">{category.short}</p>
                      <p className={styles.serviceFoot}>
                        <span>
                          from <strong className="t-num">{formatRupees(from)}</strong>
                        </span>
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section section-sand" id="how-it-works">
        <div className="container">
          <SectionHeading
            label="How it works"
            script="booked in two taps"
            title="From sofa to street in three steps"
            align="center"
          />
          <div className={styles.steps}>
            <svg className={styles.stepsRoute} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M40 80 C 200 -10, 300 140, 500 60 S 820 0, 960 70" />
            </svg>
            {STEPS.map((step, index) => (
              <Reveal key={step.title} className={styles.step} delay={index * 120}>
                <span className={`t-headline ${styles.stepNumber}`}>{step.script}</span>
                <h3 className="t-title">{step.title}</h3>
                <p className="t-muted">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Live tracking + report ---------- */}
      <section className="section section-dark" id="walk-report">
        <div className={`container ${styles.reportGrid}`}>
          <div>
            <SectionHeading
              tone="dark"
              label="The walk report"
              script="see every step"
              title="Know exactly where they went and how they were"
              intro="Your walker starts the walk in the PawMile app. You follow the route live, then get a report with the distance, time, toilet breaks, mood and a fresh photo."
            />
            <ul className={styles.reportList}>
              {REPORT_FEATURES.map((item) => (
                <li key={item.text}>
                  <span className={styles.reportListIcon}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.reportVisual}>
            <div className={styles.reportPhoto} aria-hidden="true">
              <Image src="/images/portrait-golden.jpg" alt="" fill sizes="(min-width: 1024px) 28vw, 70vw" />
            </div>
            <Reveal className={styles.reportMain}>
              <ReportCard
                data={{
                  petName: "Bruno",
                  walkerName: "Priya",
                  mood: "Energetic",
                  dateLabel: "Today",
                  distanceMeters: 2480,
                  durationMinutes: 32,
                  pee: true,
                  poo: true,
                  water: true,
                  fed: false,
                  route: SAMPLE_ROUTE,
                  note: "Bruno pulled towards every cat on 12th Main but settled after the park. Paws wiped and water bowl filled.",
                  photoUrl: "/images/portrait-golden.jpg",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Trust & safety ---------- */}
      <section className="section" id="safety">
        <div className="container">
          <SectionHeading
            label="Trust & safety"
            script="walkers we'd trust"
            title="Five checks before anyone holds your dog's leash"
            intro="We'd rather turn applicants away than lower the bar. Every walker goes through the same process, and only after all five steps do they meet your pet."
          />
          <ol className={styles.vetting}>
            {VETTING_STEPS.map((step, index) => (
              <Reveal as="li" key={step.title} className={styles.vettingItem} delay={index * 70}>
                <span className={styles.vettingIndex}>0{index + 1}</span>
                <span className={styles.vettingIcon}>
                  <Icon name={step.icon} size={24} />
                </span>
                <h3 className={styles.vettingTitle}>{step.title}</h3>
                <p className="t-muted">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Local care ---------- */}
      <section className={`section section-sand ${styles.localSection}`}>
        <div className={`container ${styles.localGrid}`}>
          <div className={styles.localPhoto}>
            <Image
              src="/images/indie-trail.jpg"
              alt="An Indian street dog walking along a leafy path"
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
            />
            <span className={`t-headline ${styles.localTag}`}>indie approved</span>
          </div>
          <div>
            <SectionHeading
              label="Made for Indian streets"
              title="Walks planned around heat, rain and the neighbourhood pack"
              intro="Our walkers grew up here. They know which lanes flood, where the shade is and which corner the street dogs guard."
            />
            <div className={styles.localCards}>
              {LOCAL_CARE.map((item) => (
                <div key={item.title} className={styles.localCard}>
                  <span className={styles.localIcon} style={{ background: item.tone }}>
                    <Icon name={item.icon} size={22} />
                  </span>
                  <div>
                    <h3 className={styles.localTitle}>{item.title}</h3>
                    <p className="t-muted">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section className="section" id="pricing">
        <div className="container">
          <SectionHeading
            label="Simple pricing"
            script="no surprises"
            title="Pay per visit, or save with a pack"
            intro="Prices include GST. No sign-up fee, no subscription lock-in."
          />
          <PricingExplorer options={options} />
        </div>
      </section>

      {/* ---------- Where we walk ---------- */}
      <section className={`section section-dark ${styles.areas}`}>
        <div className="container">
          <div className={styles.areasGrid}>
            <div>
              <p className={`t-label ${styles.areasLabel}`}>Where we walk</p>
              <h2 className="t-title-lg">
                Across {site.launchCity}, one neighbourhood at a time
              </h2>
              <p className={`t-body-lg t-muted ${styles.areasIntro}`}>
                We grow slowly so every area has enough walkers and backups. Not here yet? Tell us
                where you are and we&apos;ll let you know the week we arrive.
              </p>
              <div className={styles.waitlist}>
                <WaitlistForm tone="dark" />
              </div>
            </div>
            <ul className={styles.areaList} aria-label={`Areas we cover in ${site.launchCity}`}>
              {site.liveAreas.map((area) => (
                <li key={area}>
                  <Icon name="map-pin" size={16} />
                  {area}
                </li>
              ))}
              {site.waitlistCities.map((city) => (
                <li key={city} className={styles.soon}>
                  {city}
                  <span>soon</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section" id="faq">
        <div className={`container ${styles.faqGrid}`}>
          <div>
            <SectionHeading
              label="Questions"
              script="ask away"
              title="Things pet parents ask us first"
            />
            <p className="t-muted">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href={`mailto:${site.email}`} className="link-underline">
                Write to us
              </a>{" "}
              and a real person replies within a working day.
            </p>
          </div>
          <FaqList items={LANDING_FAQS} />
        </div>
      </section>

      {/* ---------- Become a walker ---------- */}
      <section className={styles.walkerBand}>
        <div className={`container ${styles.walkerGrid}`}>
          <div className={styles.walkerPhoto}>
            <Image
              src="/images/group-walk.jpg"
              alt="People walking their dogs together along a park path"
              fill
              sizes="(min-width: 960px) 45vw, 92vw"
            />
          </div>
          <div className={styles.walkerCopy}>
            <p className="t-label t-accent">Join the pack</p>
            <p className={`t-headline ${styles.walkerScript}`}>love dogs? get paid.</p>
            <h2 className="t-title-lg">Walk with PawMile, on your schedule</h2>
            <p className="t-body-lg t-muted">
              Pick the hours and neighbourhoods that suit you. We train you, give you the kit and
              pay every week.
            </p>
            <ul className={styles.walkerPerks}>
              <li>
                <Icon name="wallet" size={18} /> Weekly payouts
              </li>
              <li>
                <Icon name="graduation" size={18} /> Free training & first aid
              </li>
              <li>
                <Icon name="map-pin" size={18} /> Walks near your home
              </li>
            </ul>
            <a href={`mailto:${site.careersEmail}?subject=I%27d%20like%20to%20walk%20with%20PawMile`} className={buttonClass("dark")}>
              Apply to walk
              <Icon name="arrow-right" size={18} className="btn-arrow" />
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
