import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
export const metadata = {
  title: "Contact the studio",
  description:
    "Contact The Pookie Craft Co. about handmade gifts, custom designs, or delivery.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <div className="section-wrap contact-page">
      <p className="eyebrow">A HELLO IS A LOVELY START</p>
      <h1>Let’s make someone’s day.</h1>
      <p className="intro-copy">
        Questions about a piece? A colour you can’t stop thinking about? We’d
        love to hear it.
      </p>
      <div className="steps-grid">
        <div>
          <h2>WhatsApp us</h2>
          {siteConfig.whatsappClean ? (
            <>
              <p>{siteConfig.whatsappDisplay}</p>
              <a
                href={whatsappLink(
                  "Hello! I'd like to enquire about a handmade gift.",
                )}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Start a conversation ↗
              </a>
            </>
          ) : (
            <>
              <p>The studio’s WhatsApp number is being confirmed.</p>
              <a href={siteConfig.instagramUrl} className="text-link">
                Reach us on Instagram ↗
              </a>
            </>
          )}
        </div>
        <div>
          <h2>A little Instagram hello</h2>
          <p>@{siteConfig.instagramHandle}</p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Visit our Instagram ↗
          </a>
        </div>
        <div>
          <h2>Write to the studio</h2>
          {siteConfig.email ? (
            <a href={`mailto:${siteConfig.email}`} className="text-link">
              {siteConfig.email}
            </a>
          ) : (
            <p>
              Our business email is being confirmed. Please use Instagram or the
              custom request form.
            </p>
          )}
          <Link href="/custom-orders" className="text-link">
            Share your custom idea ↗
          </Link>
        </div>
      </div>
      <p>Handmade in India · Delivery across India</p>
      <p>
        Availability, final prices, delivery charges, preparation time, and
        advance payment are confirmed directly with you.
      </p>
    </div>
  );
}
