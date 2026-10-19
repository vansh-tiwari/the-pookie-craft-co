"use client";
import { useState } from "react";
import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
const initial = {
  name: "",
  contact: "",
  idea: "",
  colors: "",
  budget: "",
  personalization: "",
  website: "",
};
export default function CustomOrdersPage() {
  const [form, setForm] = useState(initial);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setId(data.id);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const message = `Hi! I submitted custom request ${id}. Product idea: ${form.idea}\nColours: ${form.colors}\nBudget: ${form.budget}\nPersonalized text/design: ${form.personalization}. Please confirm the possibilities, price, and delivery details.`;
  return (
    <div className="section-wrap custom-page">
      <p className="eyebrow">CUSTOM CRAFT STUDIO</p>
      <h1>Custom Order Request</h1>
      <p className="intro-copy">
        Custom bouquets, personalised keychains, or glowing floral lamps.
        Share your idea below. Our artisans will review your request and confirm all details in chat.
      </p>
      <div className="steps-grid">
        {[
          ["01", "Dream it up", "Share your idea, colours, and budget."],
          [
            "02",
            "Make it yours",
            "We’ll discuss the design, final quote, and timing.",
          ],
          [
            "03",
            "Made with love",
            "Once agreed and advance payment is received, the crafting can begin.",
          ],
        ].map(([n, t, d]) => (
          <div key={n}>
            <span>{n} ✿</span>
            <h2>{t}</h2>
            <p>{d}</p>
          </div>
        ))}
      </div>
      {id ? (
        <div className="request-success" role="status">
          <span>♡</span>
          <h2>Your idea is in our studio inbox.</h2>
          <p>Request reference: {id}</p>
          <p>
            The owner will review your request and contact you using the details
            you provided. Price, availability, and delivery will be confirmed in
            conversation.
          </p>
          <a
            className="pill-button"
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
          >
            Continue on WhatsApp ↗
          </a>
          <a
            className="text-link"
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Say hello on Instagram ↗
          </a>
          <button
            className="text-link"
            onClick={() => {
              setId("");
              setForm(initial);
            }}
          >
            Start another request
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="request-form stack-form">
          <h2>Share your vision with our studio</h2>
          <div className="form-grid">
            {(
              [
                {
                  key: "name",
                  label: "Your name",
                  placeholder: "What should we call you?",
                },
                {
                  key: "contact",
                  label: "Email or phone number",
                  placeholder: "So we can get back to you",
                },
                {
                  key: "colors",
                  label: "Preferred colours",
                  placeholder: "Pink and lilac, or help me choose",
                },
                {
                  key: "budget",
                  label: "Your budget (₹)",
                  placeholder: "A range is lovely too",
                },
              ] as const
            ).map((f) => (
              <label key={f.key}>
                {f.label} *
                <input
                  required
                  maxLength={200}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <label>
            Product idea *
            <textarea
              required
              maxLength={2000}
              rows={4}
              value={form.idea}
              placeholder="Tell us what you're imagining, who it's for, and any occasion or date."
              onChange={(e) => setForm({ ...form, idea: e.target.value })}
            />
          </label>
          <label>
            Personalized text / design *
            <textarea
              required
              maxLength={2000}
              rows={3}
              value={form.personalization}
              placeholder="Your message, name, design details, or ‘no text’."
              onChange={(e) =>
                setForm({ ...form, personalization: e.target.value })
              }
            />
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>
          <p className="small-note">
            Your request and contact details are stored securely for the owner
            to respond. Read our <Link href="/privacy">privacy policy</Link>.
            You can share reference images in the follow-up conversation.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button disabled={busy} className="pill-button">
            {busy ? "Saving your idea…" : "Send my little idea ↗"}
          </button>
        </form>
      )}
    </div>
  );
}
