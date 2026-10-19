import Link from "next/link";
export default function NotFound() {
  return (
    <div className="section-wrap empty-state">
      <p className="eyebrow">404 / A LITTLE LOST?</p>
      <h1>This little creation isn’t here.</h1>
      <p>
        It may have moved or is no longer listed. Let’s find something lovely.
      </p>
      <Link className="pill-button" href="/shop">
        Back to the shop ↗
      </Link>
    </div>
  );
}
