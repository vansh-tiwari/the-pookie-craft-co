import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
export const metadata = {
  title: "Our story",
  description:
    "Meet The Pookie Craft Co. and our love for thoughtful handmade flowers and keepsakes.",
  alternates: { canonical: "/story" },
};
export default async function StoryPage() {
  const { home } = await getCatalog();
  return (
    <div className="section-wrap">
      <div className="story-page">
        <div>
          <p className="eyebrow">CONTEMPORARY INDIAN CRAFT</p>
          <h1>
            Made to be kept.
            <br />
            Given with love.
          </h1>
          <p className="intro-copy">{home.story}</p>
          <p>
            From velvety blossoms that never need watering to handcrafted jersey keychains
            and glowing Lumiflower lamps, we craft pieces meant to be treasured.
            Each creation is hand-sculpted in our India studio from tactile chenille wire.
          </p>
          <Link href="/custom-orders" className="pill-button">
            Create a Custom Gift ↗
          </Link>
        </div>
        <div className="detail-photo">
          <Image
            src="/images/products/pipe_cleaner_roses.jpg"
            alt="Handmade pink chenille rose bouquet"
            fill
            priority
            className="object-cover"
            sizes="(max-width:760px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="steps-grid">
        <div>
          <h2>Thoughtfully handmade</h2>
          <p>Care in every loop, petal, and finishing touch.</p>
        </div>
        <div>
          <h2>A little more personal</h2>
          <p>
            Tell us your colours and your idea. We’ll discuss what we can
            create.
          </p>
        </div>
        <div>
          <h2>Happiness, delivered</h2>
          <p>
            We ship across India. Charges and timings are agreed before your
            order.
          </p>
        </div>
      </div>
    </div>
  );
}
