import Link from "next/link";
export function InformationPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <article className="section-wrap information-page">
      <p className="eyebrow">THE HELPFUL LITTLE DETAILS</p>
      <h1>{title}</h1>
      <p className="intro-copy">{intro}</p>
      {sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
        </section>
      ))}
      <Link href="/contact" className="text-link">
        Need a little help? Contact the studio ↗
      </Link>
    </article>
  );
}
