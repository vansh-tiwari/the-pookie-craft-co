"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="section-wrap empty-state">
      <h1>A little snag in the thread.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <button className="pill-button" onClick={reset}>
        Try again
      </button>
      <a href="/contact" className="text-link">
        Contact the studio
      </a>
    </div>
  );
}
