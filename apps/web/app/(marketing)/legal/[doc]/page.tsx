import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, legalDoc } from "../../../content/legal";
import styles from "./legal.module.css";

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata(props: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc: slug } = await props.params;
  const doc = legalDoc(slug);
  return doc ? { title: doc.title, description: doc.summary } : {};
}

// Policy pages linked from the app and its store listings.
export default async function LegalPage(props: PageProps<"/legal/[doc]">) {
  const { doc: slug } = await props.params;
  const doc = legalDoc(slug);
  if (!doc) notFound();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <nav className={styles.nav} aria-label="Policies">
          {LEGAL_DOCS.map((item) => (
            <Link key={item.slug} href={`/legal/${item.slug}`} aria-current={item.slug === doc.slug ? "page" : undefined}>
              {item.title}
            </Link>
          ))}
        </nav>
        <article className={styles.prose}>
          <p className="t-label t-accent">Last updated {doc.updated}</p>
          <h1 className="t-title-lg">{doc.title}</h1>
          <p className={styles.summary}>{doc.summary}</p>
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
