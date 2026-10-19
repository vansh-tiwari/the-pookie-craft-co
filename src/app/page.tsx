import React from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CraftValues } from "@/components/home/CraftValues";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { StorySection } from "@/components/home/StorySection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { InstagramFeed } from "@/components/home/InstagramFeed";

export const metadata = {
  title: "The Pookie Craft Co. | Turning Pipe Cleaners Into Petals",
  description:
    "Discover handcrafted forever bouquets, custom IPL jersey keychains, and ambient Lumiflower lamps that never wilt. Handcrafted with love in India. Order directly via WhatsApp or Instagram.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <FeaturedSection />
      <CraftValues />
      <StorySection />
      <ReviewsSection />
      <InstagramFeed />
    </div>
  );
}
