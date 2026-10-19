"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function OwnerLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="section-wrap login-wrap">
      <p className="eyebrow">FOR THE HANDS BEHIND THE HAPPY</p>
      <h1>Hello, maker.</h1>
      <p>Sign in to look after your little studio.</p>
      <form className="stack-form" onSubmit={submit}>
        <label>
          Email
          <input type="email" required name="email" autoComplete="username" />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            name="password"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="pill-button" disabled={busy}>
          {busy ? "Signing in…" : "Open the studio ↗"}
        </button>
        <p className="small-note">
          Forgot your password? Ask the account owner or developer to reset the
          server-side password configuration using the documented recovery
          process.
        </p>
      </form>
    </div>
  );
}
